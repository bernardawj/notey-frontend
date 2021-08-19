import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from './modal.service';
import { Task } from '../../dashboard/task/task.model';
import { Project } from '../../dashboard/project/project.model';
import { ModalType } from './modal-type.enum';
import { ModalAction } from './modal-action.enum';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AssignTask } from '../../model/task/assign-task.model';
import { AssignedUser } from '../model/assigned-user.model';
import { RemoveProjectAssignment } from '../../model/project/remove-project-assignment.model';
import { Subscription } from 'rxjs';
import { TaskCompletion } from '../../model/task/task-completion.model';

@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {

  expandModal: boolean;
  action: ModalAction | undefined;
  type: ModalType | undefined;
  data: any;
  id: number;
  name: string;

  assignmentForm!: FormGroup;

  subscriptions: Subscription[];

  constructor(private modalService: ModalService, private formBuilder: FormBuilder) {
    this.expandModal = false;
    this.id = 0;
    this.name = '';
    this.assignmentForm = this.formBuilder.group({});
    this.subscriptions = [];
  }

  // Angular lifecycles

  ngOnInit(): void {
    const expandSub: Subscription = this.modalService.expandSubject.subscribe(modal => {
      let data;

      if (modal.type === ModalType.TASK) {
        data = <Task>modal.data;
        this.id = data.id;
        this.name = data.name;
      } else if (modal.type === ModalType.PROJECT) {
        data = <Project>modal.data;
        this.id = data.id;
        this.name = data.name;
      } else if (modal.type === ModalType.ASSIGNED_USER) {
        data = <AssignedUser>modal.data;
        this.id = data.userId;
        this.name = data.firstName + ' ' + data.lastName;
      }

      this.expandModal = modal.expand;
      this.action = modal.action;
      this.data = modal.data;
      this.type = modal.type;

      if (this.action === ModalAction.ASSIGN) {
        this.buildForm();
      }
    });

    this.subscriptions.push(expandSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  actionColorClass(): string {
    if (this.action === ModalAction.UPDATE || this.action == ModalAction.DELETE || this.action == ModalAction.REMOVE) {
      return 'text--danger';
    } else {
      return 'text--success';
    }
  }

  onConfirm(): void {
    switch (this.type) {
      case ModalType.PROJECT:
        // Actions for projects
        if (this.action === ModalAction.DELETE || this.action === ModalAction.UPDATE) {
          this.modalService.projectConfirmationSubject.next(this.id);
        } else {
          const userId = this.assignmentForm.get('user')?.value;
          this.modalService.taskAssignmentSubject.next(new AssignTask(this.getTaskData().id, userId, 0, true));
        }
        break;
      case
      ModalType.TASK:
        // Actions for tasks
        if (this.action === ModalAction.ASSIGN) {
          const userId = this.assignmentForm.get('user')?.value;
          this.modalService.taskAssignmentSubject.next(new AssignTask(this.getTaskData().id, userId, 0, true));
        } else if (this.action === ModalAction.REMOVE) {
          this.modalService.taskAssignmentSubject.next(new AssignTask(this.getTaskData().id, this.getTaskData().user.id, 0, false));
        } else if (this.action === ModalAction.DELETE || this.action === ModalAction.UPDATE) {
          this.modalService.taskConfirmationSubject.next(this.id);
        } else if (this.action === ModalAction.COMPLETE) {
          this.modalService.taskCompletionSubject.next(new TaskCompletion(this.getTaskData().id, this.getTaskData().user.id, true));
        } else if (this.action === ModalAction.INCOMPLETE) {
          this.modalService.taskCompletionSubject.next(new TaskCompletion(this.getTaskData().id, this.getTaskData().user.id, false));
        }
        break;
      case
      ModalType.ASSIGNED_USER:
        // Actions for user assignment
        if (this.action === ModalAction.REMOVE) {
          this.modalService.removeProjectAssignmentSubject.next(new RemoveProjectAssignment(-1, this.id, -1));
        }
        break;
    }

    if (this.assignmentForm.valid) {
      this.expandModal = false;
    }
  }

  isDeleteOrUpdate(): boolean {
    return this.action === ModalAction.DELETE || this.action === ModalAction.UPDATE || this.action === ModalAction.REMOVE;
  }

  isMark(): boolean {
    return this.action === ModalAction.COMPLETE || this.action === ModalAction.INCOMPLETE;
  }

  isAssignTask(): boolean {
    return this.action === ModalAction.ASSIGN && this.type === ModalType.TASK;
  }

  getTaskData(): Task {
    return <Task>this.data;
  }

  private buildForm(): void {
    if (this.action === ModalAction.ASSIGN) {
      this.assignmentForm.addControl('user', new FormControl('', [Validators.required]));
    }
  }
}
