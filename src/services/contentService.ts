import { ApiResponse } from '@/types/apiResponse';
import api from './api';
import { Content, ContentFilters, DashboardStats } from '@/types';

const contentService = {

  async getAll(filters: ContentFilters = {}): Promise<{ contents: Content[] }> {
    const params: Record<string, string> = {};
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    const response = await api.get<{ contents: Content[] }>('/content', { params });
    return response.data;
  },

  async getById(id: string): Promise<{ content: Content }> {
    const response = await api.get<{ content: Content }>(`/content/${id}`);
    return response.data;
  },

  async create(contentData: FormData): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/content', contentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/content/${id}`);
    return response.data;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/content');
    const contents = response.data.contents;

    return {
      total: contents.length,
      pending: contents.filter((c: any) => c.status === 'pending').length,
      approved: contents.filter((c: any) => c.status === 'approved').length,
      rejected: contents.filter((c: any) => c.status === 'rejected').length,
    };
  },

};

export default contentService;