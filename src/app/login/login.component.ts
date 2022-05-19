import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { DataSharingService } from '../_services/data-sharing.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  constructor(private authService: AuthService, private DataSharingService: DataSharingService, private tokenStorage: TokenStorageService, public router: Router) { }
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;
    this.authService.login(username, password)
    .subscribe(data => {
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.tokenStorage.saveToken(data);
        this.DataSharingService.isUserLoggedIn.next(true);
        this.router.navigate(['home']);
        // setTimeout(() => {
        //   this.router.navigate(['home']);
        // }, 2000);
        
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }
}