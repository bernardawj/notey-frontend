import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Task } from '../task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { CreateTask } from '../../../model/task/create-task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {

  error: string;
  @Input() isEdit: boolean;

  form!: FormGroup;
  task: Task | null;
  projectId: number | null;

  constructor(private taskService: TaskService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) {
    this.error = '';
    this.isEdit = false;
    this.task = null;
    this.projectId = null;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      type: new FormControl('', [Validators.required]),
      startAt: new FormControl(null, [Validators.required]),
      endAt: new FormControl(null, [Validators.required])
    });

    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
  }

  onSubmit(): void {
    const name = this.form.get('name')?.value;
    const description = this.form.get('description')?.value;
    const type = this.form.get('type')?.value;
    const startAt = this.form.get('startAt')?.value;
    const endAt = this.form.get('endAt')?.value;

    if (!this.isEdit) {
      this.taskService.createTask(new CreateTask(name, description, type, startAt, endAt, this.projectId!)).subscribe(
        () => {
          this.router.navigate(['/dashboard/project/details', this.projectId]).finally();
        }, error => {
          this.error = error.error.message;
        }
      )
    } else {
      return;
    }
  }
}
