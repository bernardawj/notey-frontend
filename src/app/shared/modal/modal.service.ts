import { EventEmitter, Injectable, Output } from '@angular/core';
import { Modal } from './modal.model';
import { AssignTask } from '../../model/task/assign-task.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  @Output() expandEmitter: EventEmitter<Modal>;

  @Output() taskConfirmationEmitter: EventEmitter<number>;

  @Output() taskAssignmentEmitter: EventEmitter<AssignTask>;

  constructor() {
    this.expandEmitter = new EventEmitter<Modal>();
    this.taskConfirmationEmitter = new EventEmitter<number>();
    this.taskAssignmentEmitter = new EventEmitter<AssignTask>();
  }
}
