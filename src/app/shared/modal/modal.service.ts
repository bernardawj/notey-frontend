import { EventEmitter, Injectable, Output } from '@angular/core';
import { Modal } from './modal.model';
import { AssignTask } from '../../model/task/assign-task.model';
import { AssignedUser } from '../model/assigned-user.model';
import { RemoveProjectAssignment } from '../../model/project/remove-project-assignment.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  @Output() expandEmitter: EventEmitter<Modal>;

  @Output() taskConfirmationEmitter: EventEmitter<number>;

  @Output() taskAssignmentEmitter: EventEmitter<AssignTask>;

  removeProjectAssignmentSubject: BehaviorSubject<RemoveProjectAssignment | null>;

  constructor() {
    this.expandEmitter = new EventEmitter<Modal>();
    this.taskConfirmationEmitter = new EventEmitter<number>();
    this.taskAssignmentEmitter = new EventEmitter<AssignTask>();
    this.removeProjectAssignmentSubject = new BehaviorSubject<RemoveProjectAssignment | null>(null);
  }
}
