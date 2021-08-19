import { EventEmitter, Injectable, Output } from '@angular/core';
import { Modal } from './modal.model';
import { AssignTask } from '../../model/task/assign-task.model';
import { RemoveProjectAssignment } from '../../model/project/remove-project-assignment.model';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  expandSubject: Subject<Modal>;
  taskConfirmationSubject: Subject<number>;
  taskAssignmentSubject: Subject<AssignTask>;
  projectConfirmationSubject: Subject<number>;
  removeProjectAssignmentSubject: Subject<RemoveProjectAssignment>;

  constructor() {
    this.expandSubject = new Subject<Modal>();
    this.taskConfirmationSubject = new Subject<number>();
    this.taskAssignmentSubject = new Subject<AssignTask>();
    this.projectConfirmationSubject = new Subject<number>();
    this.removeProjectAssignmentSubject = new Subject<RemoveProjectAssignment>();
  }
}
