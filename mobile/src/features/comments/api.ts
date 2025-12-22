import { http } from '../../shared/lib/http';
import type { PaginatedResponse } from '../../shared/types/api';
import type { CommentDto, CreateCommentInput, CreateCommentResponse } from './types';

export const commentsApi = {
  listByBurger: async (burgerId: string, page = 1, limit = 10) => {
    const { data } = await http.get<PaginatedResponse<CommentDto>>(
      `/burgers/${burgerId}/comments?page=${page}&limit=${limit}`,
    );
    return data;
  },

  create: async (burgerId: string, input: CreateCommentInput) => {
    const { data } = await http.post<CreateCommentResponse>(
      `/burgers/${burgerId}/comments`,
      input,
    );
    return data;
  },
};