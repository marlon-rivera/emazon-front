import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{

  constructor(readonly router: Router, readonly authService: AuthService) { }

  login(): void{
    this.router.navigate(['/control-panel'])
    this.authService.login();
  }

}
