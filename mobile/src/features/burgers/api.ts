import { http } from '../../shared/lib/http';
import { PaginatedResponse } from '../../shared/types/api';
import type { BurgerCreateResponse, BurgerDetail, BurgerListItem, CreateBurgerInput } from './types';

export const burgersApi = {
  list: async (page = 1, limit = 10) => {
    const { data } = await http.get<PaginatedResponse<BurgerListItem>>(
      `/burgers?page=${page}&limit=${limit}`,
    );
    return data;
  },
  getById: async (id: string) => {
    const { data } = await http.get<BurgerDetail>(`/burgers/${id}`);
    return data;
  },
  create: async (input: CreateBurgerInput) => {
    const { data } = await http.post<BurgerCreateResponse>('/burgers', input);
    return data;
  },
};