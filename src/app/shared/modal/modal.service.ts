import { Injectable } from '@angular/core';
import { Modal } from './modal.model';
import { AssignTask } from '../../model/task/assign-task.model';
import { RemoveProjectAssignment } from '../../model/project/remove-project-assignment.model';
import { Subject } from 'rxjs';
import { TaskCompletion } from '../../model/task/task-completion.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  expandSubject: Subject<Modal>;
  taskCompletionSubject: Subject<TaskCompletion>;
  taskConfirmationSubject: Subject<number>;
  taskAssignmentSubject: Subject<AssignTask>;
  projectConfirmationSubject: Subject<number>;
  removeProjectAssignmentSubject: Subject<RemoveProjectAssignment>;

  constructor() {
    this.expandSubject = new Subject<Modal>();
    this.taskCompletionSubject = new Subject<TaskCompletion>();
    this.taskConfirmationSubject = new Subject<number>();
    this.taskAssignmentSubject = new Subject<AssignTask>();
    this.projectConfirmationSubject = new Subject<number>();
    this.removeProjectAssignmentSubject = new Subject<RemoveProjectAssignment>();
  }
}
