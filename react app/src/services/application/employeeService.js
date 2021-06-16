import { EMPOYEE_ENDPOINTS } from '../../constants/ApiEndPoints';
import { http } from '../httpService';

export const employeeService = {
  get_all: async () => http.get(EMPOYEE_ENDPOINTS.get_all),
  get_single: async id => http.get(`${EMPOYEE_ENDPOINTS.get_single}/${id}`),
  create: async data => http.post(EMPOYEE_ENDPOINTS.create, data),
  update: async (id, updatedData) => http.put(`${EMPOYEE_ENDPOINTS.update}/${id}`, updatedData),
  remove: async id => http.delete(`${EMPOYEE_ENDPOINTS.remove}/${id}`),
};
