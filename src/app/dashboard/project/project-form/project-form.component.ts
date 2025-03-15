import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../project.service';
import { Project } from '../project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { CreateProject } from '../../../model/project/create-project.model';
import { UpdateProject } from '../../../model/project/update-project.model';
import { AlertService } from '../../../shared/alert/alert.service';
import { Alert } from '../../../shared/alert/alert.model';
import { AlertType } from '../../../shared/alert/alert-type.enum';
import { Observable, Subscription } from 'rxjs';
import { FormUtility } from '../../../shared/utility/form.utility';
import { Location } from '@angular/common';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit, OnDestroy {

  form!: UntypedFormGroup;
  project?: Project;
  userId!: number;

  subscriptions: Subscription[];

  @Input()
  isEdit: boolean;
  isLoading: boolean;

  constructor(private projectService: ProjectService, private authService: AuthService, private alertService: AlertService,
              private formBuilder: UntypedFormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private location: Location) {
    this.isEdit = false;
    this.isLoading = true;
    this.subscriptions = [];
  }

  // Angular lifecycles

  ngOnInit(): void {
    // Initialize form data
    this.initFormData(false);

    // Load project data
    const authSub: Subscription = this.authService.auth.subscribe(auth => {
      if (auth) {
        // Set user ID for easier usage
        this.userId = auth.user.id;

        this.activatedRoute.params.subscribe(param => {
          if (param['id']) {
            this.loadProject(+param['id'], this.userId);
          } else {
            this.isLoading = false;
          }
        });
      }
    });

    this.subscriptions.push(authSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  onSubmit(): void {
    this.isLoading = true;

    // Trim all control values
    FormUtility.trimValues(this.form.controls);

    // Retrieve form data
    const name = this.form.get('name')?.value;
    const description = this.form.get('description')?.value;
    const startAt = this.form.get('startAt')?.value;
    const endAt = this.form.get('endAt')?.value;

    // Call service
    this.callProjectService(name, description, startAt, endAt);
  }

  goBack(): void {
    this.location.back();
  }

  // Private methods

  private loadProject(projectId: number, userId: number): void {
    const projectSub: Subscription = this.projectService.getProject(projectId, userId).subscribe(
      project => {
        // Check if user is the project manager
        this.project = project;
        this.initFormData(true);
        this.isLoading = false;
        this.alertService.alertSubject.next(new Alert('Successfully retrieved project details.', AlertType.SUCCESS));
      },
      error => {
        this.isLoading = false;
        this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
        this.router.navigate(['/dashboard/project/list']).finally();
      }
    );

    this.subscriptions.push(projectSub);
  }

  private initFormData(withValues: boolean): void {
    if (withValues) {
      if (this.project) {
        this.form.get('name')?.setValue(this.project.name);
        this.form.get('description')?.setValue(this.project.description);
        this.form.get('startAt')?.setValue(this.project.startAt);
        this.form.get('endAt')?.setValue(this.project.endAt);
      }
    } else {
      this.form = this.formBuilder.group({
        name: new UntypedFormControl(''.trim(), [Validators.required, Validators.maxLength(50)]),
        description: new UntypedFormControl(''.trim(), [Validators.required, Validators.maxLength(255)]),
        startAt: new UntypedFormControl(''.trim(), [Validators.required]),
        endAt: new UntypedFormControl(''.trim(), [Validators.required])
      });
    }
  }

  private callProjectService(name: string, description: string, startAt: Date, endAt: Date): void {
    let callingService: Observable<Project>;

    if (this.isEdit && this.project) {
      callingService = this.projectService.updateProject(new UpdateProject(this.project.id, name, description, startAt, endAt, this.userId))
    } else {
      callingService = this.projectService.createProject(new CreateProject(name, description, startAt, endAt, this.userId));
    }

    const projectSub: Subscription = callingService.subscribe(
      project => {
        this.alertService.alertSubject.next(new Alert(`Successfully ${ this.isEdit ? 'updated' : 'created' } Project (${ project.name }).`, AlertType.SUCCESS));
        this.router.navigate(['/dashboard/project/details', project.id]).finally();
      },
      error => {
        this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
        this.isLoading = false;
      }
    );

    this.subscriptions.push(projectSub);
  }
}
