import { Component, OnInit } from '@angular/core';
import { ModalService } from './modal.service';
import { Task } from '../../dashboard/task/task.model';
import { Project } from '../../dashboard/project/project.model';
import { ModalType } from './modal-type.enum';
import { ModalAction } from './modal-action.enum';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AssignTask } from '../../model/task/assign-task.model';

@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css']
})
export class ModalComponent implements OnInit {

  expandModal: boolean;
  action: ModalAction | undefined;
  type: ModalType | undefined;
  data: any;
  id: number;
  name: string;

  assignmentForm!: FormGroup;

  constructor(private modalService: ModalService, private formBuilder: FormBuilder) {
    this.expandModal = false;
    this.id = 0;
    this.name = '';
  }

  ngOnInit(): void {
    this.modalService.expandEmitter.subscribe(modal => {
      let data;

      if (modal.type === ModalType.TASK) {
        data = <Task>modal.data;
        this.id = data.id;
        this.name = data.name;
      } else if (modal.type === ModalType.PROJECT) {
        data = <Project>modal.data;
        this.id = data.id;
        this.name = data.name;
      }

      this.expandModal = modal.expand;
      this.action = modal.action;
      this.data = modal.data;
      this.type = modal.type;

      if (this.action === ModalAction.ASSIGN) {
        this.buildForm();
      }
    });
  }

  actionColorClass(): string {
    if (this.action === ModalAction.UPDATE || this.action == ModalAction.DELETE) {
      return 'text--danger';
    } else {
      return 'text--success';
    }
  }

  onConfirm(): void {
    if (this.action === ModalAction.DELETE || this.action === ModalAction.UPDATE) {
      this.modalService.taskConfirmationEmitter.emit(this.id);
    } else {
      const userId = this.assignmentForm.get('user')?.value;
      this.modalService.taskAssignmentEmitter.emit(new AssignTask(this.getTaskData().id, userId, 0, true));
    }

    if (this.assignmentForm.valid) {
      this.expandModal = false;
    }
  }

  isAssignTask(): boolean {
    return this.action === ModalAction.ASSIGN && this.type === ModalType.TASK;
  }

  getTaskData(): Task {
    return <Task>this.data;
  }

  private buildForm(): void {
    this.assignmentForm = this.formBuilder.group({});

    if (this.action === ModalAction.ASSIGN) {
      this.assignmentForm.addControl('user', new FormControl('', [Validators.required]))
    }
  }
}
