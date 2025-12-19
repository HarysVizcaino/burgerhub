import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import express from 'express';
import { CreateBurgerDto } from './dto/create-burger.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BurgersService } from './burgers.service';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { AddCollaboratorDto } from './dto/add-collaborator.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { BurgerListItemDto } from './dto/burger-list-item.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { BurgerDetailDto } from './dto/burger-detail.dto';

@ApiTags('Burgers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('burgers')
export class BurgersController {
    constructor(private readonly burgersService: BurgersService) {}

    
    @ApiOperation({ summary: 'Create a new burger' })
    @ApiBody({ type: CreateBurgerDto })
    @ApiResponse({ status: 201, description: 'Burger created successfully' })
    @Post()
    create(@Body() dto: CreateBurgerDto, @Req() req: express.Request) {
      return this.burgersService.create({
        ...dto,
        creatorId: (req as any).user.userId,
      });
    }

    @ApiOperation({ summary: 'Invite a new collaborator to a burger' })
    @ApiBody({ type: AddCollaboratorDto })
    @ApiResponse({ status: 201, description: 'Collaborator invited successfully' })
    @Post(':id/collaborators')
    invite(
      @Param('id', ParseObjectIdPipe) burgerId: string,
      @Body() dto: AddCollaboratorDto,
      @Req() req: express.Request,
    ) {

      const collaboratorId = new ParseObjectIdPipe().transform(dto.userId);

      return this.burgersService.inviteCollaborator({
        burgerId,
        collaboratorId,
        requesterId: (req as any).user.userId,
      });
    }

    @ApiOperation({ summary: 'Get a burger by id' })
    @ApiResponse({ status: 200, type: BurgerDetailDto })
    @Get(':id')
    findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<BurgerDetailDto> {
      return this.burgersService.findByIdDetails(id);
    }

    @ApiOperation({ summary: 'Get all burgers' })
    @ApiResponse({ status: 200, type: PaginatedResponseDto<BurgerListItemDto> })
    @Get()
    findAll(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<BurgerListItemDto>> {
      return this.burgersService.findPaginated(query.page, query.limit);
    }


    @ApiOperation({ summary: 'Remove a collaborator from a burger' })
    @ApiResponse({ status: 200, description: 'Collaborator removed successfully' })
    @Delete(':id/collaborators/:userId')
    removeCollaborator(
      @Param('id', ParseObjectIdPipe) burgerId: string,
      @Param('userId', ParseObjectIdPipe) collaboratorId: string,
      @Req() req: express.Request,
    ) {
      return this.burgersService.removeCollaborator({
        burgerId,
        collaboratorId,
        requesterId: (req as any).user.userId,
      });
    }

  }