import { Content } from '@/types';
import api from './api';

const approvalService = {

  
  async approve(id:string):Promise<{content:Content}> {
    const response = await api.patch<{content:Content}>(`/content/approve?id=${id}`);
    return response.data;
  },

  
  async reject(id:string, reason:string):Promise<{content:Content}> {
    const response = await api.patch<{content:Content}>(`/content/reject?id=${id}`, { reason });
    return response.data;
  },

};

export default approvalService;