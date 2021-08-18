import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AlertService } from '../alert/alert.service';
import { Alert } from '../alert/alert.model';
import { AlertType } from '../alert/alert-type.enum';

@Component({
  selector: 'app-filter',
  templateUrl: 'filter.component.html',
  styleUrls: ['filter.component.css']
})
export class FilterComponent implements OnInit {

  toggled: boolean;
  filterForm!: FormGroup;
  currentFilter: string;

  @Output() filterEmitter: EventEmitter<string>;

  constructor(private alertService: AlertService, private formBuilder: FormBuilder) {
    this.toggled = false;
    this.filterEmitter = new EventEmitter<string>();
    this.currentFilter = '';
  }

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      search: new FormControl('')
    });
  }

  onFilter(): void {
    this.currentFilter = this.filterForm.get('search')?.value;
    this.filterEmitter.next(this.currentFilter);
  }
}
