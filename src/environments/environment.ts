// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const INITIAL_URI = 'http://localhost:4444/api';

export const environment = {
  production: false,
  endpoints: {
    auth: {
      login: `${INITIAL_URI}/v1/auth/login`,
      register: `${INITIAL_URI}/v1/auth/register`
    },
    user: {
      getUserDetails: `${INITIAL_URI}/v1/user`,
      updateProjectAcceptance: `${INITIAL_URI}/v1/user/project/acceptance`
    },
    project: {
      getAllManagedProjects: `${ INITIAL_URI }/v1/project/managed`,
      getAllAssignedProjects: `${ INITIAL_URI }/v1/project/assigned`,
      getProject: `${ INITIAL_URI }/v1/project`,
      createProject: `${ INITIAL_URI }/v1/project`,
      updateProject: `${ INITIAL_URI }/v1/project`
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
