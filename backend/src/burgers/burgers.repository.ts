import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Burger } from './schemas/burger.schema';

export type CreateBurgerInput = {
  name: string;
  ingredients: string[];
  image?: string;
  creatorId: string;
  };


@Injectable()
export class BurgersRepository { 
    constructor(
        @InjectModel(Burger.name)
        private readonly burgerModel: Model<Burger>,
      ) {}

      create(input: CreateBurgerInput): Promise<Burger> {
        return this.burgerModel.create({
          name: input.name.trim(),
          ingredients: input.ingredients,
          image: input.image,
          creator: new Types.ObjectId(input.creatorId.toString()),
        });
      }

      existsById(id: string): Promise<boolean> {
        return this.burgerModel.exists({ _id: new Types.ObjectId(id) }).then(Boolean);
      }
      
      findByIdPopulated(id: string) {
        return this.burgerModel.findById(id).populate('creator', 'name email');
      }

      
      findDetailsById(burgerId: string) {
        const _id = new Types.ObjectId(burgerId);
    
        const pipeline: PipelineStage[] = [
          { $match: { _id } },
    
          // creator populated
          {
            $lookup: {
              from: 'users',
              localField: 'creator',
              foreignField: '_id',
              as: 'creator',
              pipeline: [{ $project: { name: 1, email: 1 } }],
            },
          },
          { $unwind: { path: '$creator', preserveNullAndEmptyArrays: true } },
    
          // commentsCount 
          {
            $lookup: {
              from: 'comments',
              let: { burgerId: '$_id' },
              pipeline: [
                { $match: { $expr: { $eq: ['$burger', '$$burgerId'] } } },
                { $count: 'count' },
              ],
              as: 'commentsMeta',
            },
          },
          {
            $addFields: {
              commentsCount: { $ifNull: [{ $arrayElemAt: ['$commentsMeta.count', 0] }, 0] },
              collaboratorsCount: { $size: { $ifNull: ['$collaborators', []] } },
            },
          },
          { $project: { commentsMeta: 0 } },
        ];
    
        return this.aggregate<any>(pipeline);
      }

      countAll(): Promise<number> {
        return this.burgerModel.countDocuments();
      }

      findByIdRaw(id: string) {
        return this.burgerModel.findById(id);
      }
      
      addCollaborator(burgerId: string, collaboratorId: string) {
        return this.burgerModel.findByIdAndUpdate(
          burgerId,
          {
            $addToSet: { collaborators: new Types.ObjectId(collaboratorId) },
          },
          { new: true },
        );
      }

      removeCollaborator(burgerId: string, collaboratorId: string) {
        return this.burgerModel.findByIdAndUpdate(
          burgerId,
          { $pull: { collaborators: new Types.ObjectId(collaboratorId) } },
          { new: true },
        );
      }

      aggregate<T = any>(pipeline: PipelineStage[]) {
        return this.burgerModel.aggregate<T>(pipeline);
      }


      async findPaginated(page = 1, limit = 10) {
        const safePage = Number.isFinite(page) && page > 0 ? page : 1;
        const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 10;
        const skip = (safePage - 1) * safeLimit;
    

        const dataPipeline: PipelineStage[] = [
          { $skip: skip },
          { $limit: safeLimit },
          ...this.creatorLookupPipeline(),
          ...this.commentsCountPipeline(),
          {
            $project: {
              name: 1,
              ingredients: 1,
              image: 1,
              createdAt: 1,
              updatedAt: 1,
              creator: 1,
              commentsCount: 1,
              collaboratorsCount: 1,
            },
          },
        ];

        const pipeline: PipelineStage[] = [
          { $sort: { createdAt: -1 } },
          {
            $facet: {
              data: dataPipeline as any[], 
              total: [{ $count: 'count' }],
            },
          },
          {
            $addFields: {
              total: { $ifNull: [{ $arrayElemAt: ['$total.count', 0] }, 0] },
            },
          },
          { $project: { data: 1, total: 1 } },
        ];
    
        const [result] = await this.aggregate<{ data: any[]; total: number }>(pipeline);
    
        return {
          data: result?.data ?? [],
          total: result?.total ?? 0,
          page: safePage,
          limit: safeLimit,
        };
      }

      private commentsCountPipeline(): PipelineStage[] {
        return [
          {
            $lookup: {
              from: 'comments',
              let: { burgerId: '$_id' },
              pipeline: [
                { $match: { $expr: { $eq: ['$burger', '$$burgerId'] } } },
                { $count: 'count' },
              ],
              as: 'commentsMeta',
            },
          },
          {
            $addFields: {
              commentsCount: { $ifNull: [{ $arrayElemAt: ['$commentsMeta.count', 0] }, 0] },
            },
          },
          { $project: { commentsMeta: 0 } },
        ];
      }
    

      private creatorLookupPipeline(): PipelineStage[] {
        return [
          {
            $lookup: {
              from: 'users',
              localField: 'creator',
              foreignField: '_id',
              as: 'creator',
              pipeline: [{ $project: { name: 1, email: 1 } }],
            },
          },
          { $unwind: { path: '$creator', preserveNullAndEmptyArrays: true } },
        ];
      }
    

    }