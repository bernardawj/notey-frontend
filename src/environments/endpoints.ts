export const getEndpoints = (INITIAL_URI: string) => {
  return {
    auth: {
      login: `${ INITIAL_URI }/v1/auth/login`
    },
    user: {
      getUserDetails: `${ INITIAL_URI }/v1/user`
    },
    project: {
      getAllManagedProjects: `${ INITIAL_URI }/v1/project/managed`,
      getAllAssignedProjects: `${ INITIAL_URI }/v1/project/assigned`,
      assignUserToProject: `${ INITIAL_URI }/v1/project/assign`,
      removeUserFromProject: `${ INITIAL_URI }/v1/project/remove-assignment`,
      getProject: `${ INITIAL_URI }/v1/project`,
      createProject: `${ INITIAL_URI }/v1/project`,
      updateProject: `${ INITIAL_URI }/v1/project`,
      updateProjectAcceptance: `${ INITIAL_URI }/v1/project/acceptance`,
      deleteProject: `${ INITIAL_URI }/v1/project`
    },
    task: {
      getTask: `${ INITIAL_URI }/v1/task`,
      createTask: `${ INITIAL_URI }/v1/task`,
      updateTask: `${ INITIAL_URI }/v1/task`,
      deleteTask: `${ INITIAL_URI }/v1/task`,
      getAllUserTasks: `${ INITIAL_URI }/v1/task/user`,
      getAllProjectTasks: `${ INITIAL_URI }/v1/task/project`,
      assignTaskToUser: `${ INITIAL_URI }/v1/task/assign`,
      markTaskAsCompleted: `${ INITIAL_URI }/v1/task/mark-completion`
    },
    notification: {
      getAllUserNotifications: `${ INITIAL_URI }/v1/notification`,
      clearAllUserNotifications: `${ INITIAL_URI }/v1/notification`
    }
  }
}
