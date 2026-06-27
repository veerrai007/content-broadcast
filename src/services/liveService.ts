import { Content } from '@/types';
import axios from 'axios';

const liveService = {

  async getActiveContent(teacherId:string): Promise<{ contents: Content[] }> {
    const response = await axios.get<{ contents: Content[] }>(`/api/live?id=${teacherId}`);
    return response.data;
  },

};

export default liveService;