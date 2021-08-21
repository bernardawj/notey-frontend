import { getEndpoints } from './endpoints';

const INITIAL_URI = 'https://notey-api-dev.herokuapp.com/api';

export const environment = {
  production: true,
  endpoints: getEndpoints(INITIAL_URI)
};
