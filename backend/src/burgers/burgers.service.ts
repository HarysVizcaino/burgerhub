import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import type { Cache } from 'cache-manager';
import { BurgersRepository, CreateBurgerInput } from './burgers.repository';
import { PipelineStage } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { BurgersMapper } from './burgers.mapper';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { BurgerListItemDto } from './dto/burger-list-item.dto';
import { BurgerDetailDto } from './dto/burger-detail.dto';

export type InviteCollaboratorInput = {
  burgerId: string;
  collaboratorId: string;
  requesterId: string;
};

@Injectable()
export class BurgersService {

  constructor(
    private readonly burgersRepo: BurgersRepository,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async create(input: CreateBurgerInput) {
    await this.cache.del(this.listCacheKey(1, 10));
    return this.burgersRepo.create(input);
  }

  async findPaginated(page = 1, limit = 10): Promise<PaginatedResponseDto<BurgerListItemDto>> {
   
    const key = this.listCacheKey(page, limit);
    const cached = await this.cache.get(key);
    if (cached) return cached as PaginatedResponseDto<BurgerListItemDto>;

    const result = await this.burgersRepo.findPaginated(page, limit);

    const data = {
      data: result.data.map(BurgersMapper.toListItem),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };

    await this.cache.set(key, data);
    return data;
  }

  findById(id: string) {
    return this.burgersRepo.findByIdPopulated(id);
  }
  
  async existsById(id: string) {
    return this.burgersRepo.existsById(id);
  }



  async findByIdDetails(id: string): Promise<BurgerDetailDto> {
    const key = this.detailCacheKey(id);
    const cached = await this.cache.get(key);
    if (cached) return cached as BurgerDetailDto;

    const result = await this.burgersRepo.findDetailsById(id);
    const burger = result?.[0];

    if (!burger) throw new NotFoundException('Burger not found');

    const data = BurgersMapper.toDetail(burger);
    await this.cache.set(key, data);
    return data;
  }


  async inviteCollaborator(input: InviteCollaboratorInput) {

    const burger = await this.burgersRepo.findByIdRaw(input.burgerId);
    if (!burger) throw new NotFoundException('Burger not found');

    const isCreator = burger.creator.toString() === input.requesterId;

    if (!isCreator) {
      throw new ForbiddenException('Only the burger creator can invite collaborators');
    }

    if (burger.creator.toString() === input.collaboratorId) {
      throw new BadRequestException('Creator is already a collaborator by default');
    }
    
    await this.cache.del(this.listCacheKey(1, 10));

    const user = await this.usersService.findById(input.collaboratorId);
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.burgersRepo.addCollaborator(input.burgerId, input.collaboratorId);
    if (!updated) throw new NotFoundException('Burger not found');

    await this.cache.del(this.listCacheKey(1, 10));

    return updated;
  }

  async removeCollaborator(input: InviteCollaboratorInput) {
    const burger = await this.burgersRepo.findByIdRaw(input.burgerId);
    if (!burger) throw new NotFoundException('Burger not found');

    const isCreator = burger.creator.toString() === input.requesterId;
    if (!isCreator) {
      throw new ForbiddenException('Only the burger creator can remove collaborators');
    }

    const isInList = burger.collaborators?.some(id => id.toString() === input.collaboratorId);
    if (!isInList) throw new BadRequestException('User is not a collaborator of this burger');

    const updated = await this.burgersRepo.removeCollaborator(input.burgerId, input.collaboratorId);
    if (!updated) throw new NotFoundException('Burger not found');

    await this.cache.del(this.listCacheKey(1, 10));

    return updated;
  }


  private listCacheKey(page: number, limit: number) {
    return `burgers:list:page=${page}:limit=${limit}`;
  }

  private detailCacheKey(id: string) {
    return `burgers:detail:${id}`;
  }

  cleanDetailCache(id: string) {
    return this.cache.del(this.detailCacheKey(id));
  }
}
