import { Component, OnInit } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormControl, FormGroupDirective, FormGroup,
  NgForm, Validators, ValidationErrors, ValidatorFn
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MessageService } from 'primeng/api';
import { AppFloatingConfigurator } from '../../core/layouts/component/app.floatingconfigurator';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./../login/login.component.scss'],
    standalone: true,
    imports: [SharedModule, RouterModule, AppFloatingConfigurator],
    providers: [MessageService]
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  registerSubscription!: Subscription;
  registerLoading = false;
  submitted = false;

  constructor(
    private authService: AuthService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.initFormBuilder();
  }

  ngOnInit() {
  }

  registerUser() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.registerLoading = true;
    this.form.disable();

    this.registerSubscription = this.authService
      .register(this.form.value)
      .pipe(finalize(() => {this.registerLoading = false; this.form.enable()}))
      .subscribe({
        next: (data) => {
          console.log("respuesta:",data);
          if (data.success) {
            this.messageService.add({
              key: 'br',
              severity: 'success',
              summary: 'Registro exitoso',
              detail: data.message || 'Usuario creado correctamente',
              life: 3500
            });

            // Redirección tras un breve delay
            setTimeout(() => this.router.navigate(['..'], { relativeTo: this.route }), 1500);
          } else {
            this.messageService.add({
              key: 'br',
              severity: 'error',
              summary: 'Error en el registro',
              detail: data.message || 'Error desconocido',
              life: 3000
            });
          }
        },
        error: (error) => {
          console.log('error at component', error);
          let errorMessage = 'Error de conexión con el servidor';
          
          if (error.status === 409) {
            errorMessage = error.error?.message || 'Email ya registrado';
          } else if (error.status === 400) {
            errorMessage = error.error?.message || 'Datos inválidos';
          }

          this.messageService.add({
            key: 'br',
            severity: 'error',
            summary: 'Error en el registro',
            detail: errorMessage,
            life: 3000
          });
        }
      });
  }

  showError(name: string, errorKey: string): boolean {
    const ctrl = this.form.get(name);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted) && !!ctrl.errors?.[errorKey];
  }

  private initFormBuilder() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      passwordConfirmation: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  private checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls['password'].value;
    const confirmPass = group.controls['passwordConfirmation'].value;
    return pass === confirmPass ? null : { notSame: true };
  }

  private regexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }
}
