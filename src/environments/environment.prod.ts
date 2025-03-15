import { getEndpoints } from './endpoints';

const INITIAL_URI = 'http://localhost:4444/api';

export const environment = {
  production: true,
  endpoints: getEndpoints(INITIAL_URI)
};
