const INITIAL_URI = 'https://notey-api.herokuapp.com/api';

export const environment = {
  production: true,
  endpoints: {
    project: {
      getAllManagedProjects: `${ INITIAL_URI }/v1/project/managed`,
      getAllAssignedProjects: `${ INITIAL_URI }/v1/project/assigned`,
      getProject: `${ INITIAL_URI }/v1/project`,
      createProject: `${ INITIAL_URI }/v1/project`
    }
  }
};
