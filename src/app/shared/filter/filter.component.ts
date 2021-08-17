import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectList } from '../../dashboard/project/project-list.model';
import { TaskList } from '../../dashboard/task/task-list.model';

@Component({
  selector: 'app-filter',
  templateUrl: 'filter.component.html',
  styleUrls: ['filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input() data: any;

  @Input() dataType: string | undefined;

  @Output() filterEmitter: EventEmitter<any>

  constructor() {
    this.filterEmitter = new EventEmitter<any>();
  }

  ngOnInit(): void {
  }

  onFilter(search: string): any {
    let filteredData;
    if (this.dataType === 'ProjectList') {
      filteredData = (<ProjectList>(this.data)).projects.filter(project => project.name.toLowerCase().includes(search.toLowerCase()));
    } else if (this.dataType === 'TaskList') {
      filteredData = (<TaskList>(this.data)).tasks.filter(task => task.name.toLowerCase().includes(search.toLowerCase()));
    }

    this.filterEmitter!.emit(filteredData);
  }
}
