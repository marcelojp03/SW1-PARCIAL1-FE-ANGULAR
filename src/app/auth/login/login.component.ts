import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { SharedModule } from '../../shared/shared.module';
import { AppFloatingConfigurator } from '../../core/layouts/component/app.floatingconfigurator';
import { MessageService } from 'primeng/api';
// import { DashboardComponent } from '../../dashboard/dashboard.component';
// import {ToastrService} from 'ngx-toastr'
// import { BitacoraService } from 'src/app/dashboard/bitacora/bitacora.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [AppFloatingConfigurator, SharedModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  message!: string;
  loginSubscription!: Subscription;
  loginLoading = false;
  checked: boolean = false;
  submitted = false;
  static path = () => ['login'];

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide);
    event.stopPropagation();
  }

  constructor(
    private authService: AuthService,
    // private bitacoraService:BitacoraService,
    public formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.initFormBuilder();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.loginSubscription?.unsubscribe();
  }

  private initFormBuilder() {
    this.form = this.formBuilder.group({
      email:new FormControl({ value: '', disabled: false }, [Validators.required, Validators.email]),
      password:new FormControl({ value: '', disabled: false }, Validators.required),
      rememberMe : new FormControl(false)
    })
  }

  control(name: keyof typeof this.form.controls): AbstractControl {
    return this.form.get(name as string)!;
  }

  showError(name: string, errorKey: string): boolean {
    const ctrl = this.form.get(name);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted) && !!ctrl.errors?.[errorKey];
  }


  loginUser() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, rememberMe } = this.form.value;
    this.loginLoading = true;
    this.form.disable();

     // Opcional: recordar email
    if (rememberMe) localStorage.setItem('remembered_email', email);
    else localStorage.removeItem('remembered_email');


    this.loginSubscription = this.authService
      .loginWithUserCredentials(this.form.value.email, this.form.value.password)
      .pipe(finalize(() => {this.loginLoading = false, this.form.enable()}))
      .subscribe({
        next: (res:any) => {
          console.info("LOGIN RESPONSE: ",res);
          if (res.status == 'success') {
            localStorage.setItem('session', JSON.stringify(res));
            localStorage.setItem('token',JSON.stringify(res.data.token))
            localStorage.setItem('usuario',JSON.stringify(res.data.usuario))
            localStorage.setItem('username',JSON.stringify(res.data.usuario.nombre_usuario));
            localStorage.setItem('name',JSON.stringify(res.data.usuario.nombre));
            localStorage.setItem('user_id',JSON.stringify(res.data.usuario.id));       
            // this.bitacoraService.registrarBitacora(); // REGISTRA LA BITACORA


            // Éxito
            this.messageService.add({
              key: 'br',
              severity: 'success',
              summary: 'Sesión iniciada correctamente',
              detail: `Bienvenido, ${res.data?.usuario?.name || ''}`,
              life: 3500
            });

            // Redirección tras un breve delay para que se vea el toast
            setTimeout(() => this.router.navigateByUrl('/dashboard'), 1500);
          }
          else if(res.status=='error'){
            const msg = res?.message || 'Correo o contraseña incorrectos';
            this.messageService.add({
              key: 'br',
              severity: 'error',
              summary: 'Correo o contraseña incorrectos',
              detail: msg,
              life: 3000
            });
          }
        },
        error: (error:any) => {
          this.messageService.add({
            key: 'br',
            severity: 'error',
            summary: 'Error de conexión',
            detail: 'No se pudo conectar con el servidor',
            life: 3000
          });
          console.error("ERROR AL INICIAR SESION" , error);
        }
    });
  }

}
