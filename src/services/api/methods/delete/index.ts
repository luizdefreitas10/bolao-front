import { AxiosRequestConfig } from 'axios';

import { api } from '../..';
import { handleAxiosError } from '../../error';

export const del = async <Response>(url: string, config?: AxiosRequestConfig) => {
  try {
    const { data } = await api.delete<Response>(url, config);
    return data;
  } catch (e) {
    throw handleAxiosError(e);
  }
};
