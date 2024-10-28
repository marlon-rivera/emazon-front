import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationType, NOTIFICATION_TYPE, ADMIN_ROLE, WAREHOUSE_ROLE, CLIENT_ROLE } from '@/app/shared/utils/api.constants';
import { AuthService } from '@/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{

  loginForm!: FormGroup;
  notificationMessage: string = '';
  notificationType: NotificationType = NOTIFICATION_TYPE.SUCCESS;
  showNotification: boolean = false;

  constructor(
    readonly fb: FormBuilder,
    readonly authService: AuthService,
    readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.notificationMessage = 'Login exitoso.';
          this.notificationType = NOTIFICATION_TYPE.SUCCESS;
          this.showNotification = true;
          this.loginForm.reset();
          this.autoHideNotification();
          if(this.authService.infoToken!.role === ADMIN_ROLE){
            this.router.navigate(["/control-panel"])
          }else if(this.authService.infoToken!.role === WAREHOUSE_ROLE || this.authService.infoToken!.role === CLIENT_ROLE){
            this.router.navigate(["/articles/list"])
          }
        },
        error: (err) => {
          this.notificationMessage = err.error.message;
          this.notificationType = NOTIFICATION_TYPE.ERROR;
          this.showNotification = true;
          this.autoHideNotification();
        }
      });
    }
  }

  autoHideNotification() {
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

}
