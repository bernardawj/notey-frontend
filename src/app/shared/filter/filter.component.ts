import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AlertService } from '../alert/alert.service';
import { TaskFilter } from '../model/filter/task-filter.model';
import { TaskType } from '../../dashboard/task/task-type.enum';
import { ProjectFilter } from '../model/filter/project-filter.model';

@Component({
  selector: 'app-filter',
  templateUrl: 'filter.component.html',
  styleUrls: ['filter.component.css']
})
export class FilterComponent implements OnInit {

  toggled: boolean;
  filterForm!: FormGroup;
  filter: TaskFilter | ProjectFilter | null;

  @Input() isTask?: boolean;
  @Output() filterEmitter: EventEmitter<ProjectFilter | TaskFilter>;

  constructor(private alertService: AlertService, private formBuilder: FormBuilder) {
    this.toggled = false;
    this.filterEmitter = new EventEmitter<ProjectFilter | TaskFilter>();
    this.filter = null;
  }

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      search: new FormControl('')
    });

    if (this.isTask) {
      this.filterForm.addControl('type', new FormControl(''));
      this.filterForm.addControl('completed', new FormControl(''));
    }
  }

  onFilter(): void {
    const searchString = this.filterForm.get('search')?.value;

    if (this.isTask) {
      let type: TaskType | null = this.filterForm.get('type')?.value;
      if (!type) {
        type = null;
      }

      let completed: boolean | null = this.filterForm.get('completed')?.value;
      if (completed) {
        completed = this.filterForm.get('completed')?.value === 'true';
      } else {
        completed = null;
      }

      this.filter = new TaskFilter(searchString, type, completed);
    } else {
      this.filter = new ProjectFilter(searchString);
    }

    this.filterEmitter.next(this.filter);
  }

  getTaskFilter(): TaskFilter | null {
    if (this.isTask) {
      return <TaskFilter>this.filter;
    } else {
      return null;
    }
  }

  getProjectFilter(): ProjectFilter | null {
    if (this.isTask) {
      return <ProjectFilter>this.filter;
    } else {
      return null;
    }
  }
}
