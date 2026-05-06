import { Content } from '@/types';
import api from './api';

const approvalService = {

  
  async approve(id:string):Promise<{content:Content}> {
    const response = await api.patch<{content:Content}>(`/content/${id}/approve`);
    return response.data;
  },

  
  async reject(id:string, reason:string):Promise<{content:Content}> {
    const response = await api.patch<{content:Content}>(`/content/${id}/reject`, { reason });
    return response.data;
  },

};

export default approvalService;