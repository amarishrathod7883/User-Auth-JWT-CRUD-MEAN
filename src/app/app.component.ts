import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from './_services/token-storage.service';
import { DataSharingService } from './_services/data-sharing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  isUserLoggedIn: boolean;
  isLoggedIn = false;
  username?: string;
  role_name?: string;
  
  constructor(private tokenStorageService: TokenStorageService, private DataSharingService: DataSharingService, private router: Router) 
  {
    this.DataSharingService.isUserLoggedIn.subscribe( value => {
      this.isLoggedIn = !!this.tokenStorageService.getToken();
      if (this.isLoggedIn) 
      {
        const user = this.tokenStorageService.getUser();
        this.username = user.username;
        this.role_name = user.role_name;
      }
    });
  }
  
  ngOnInit(): void 
  {
  }

  logout(): void 
  {
    this.tokenStorageService.signOut();
    this.router.navigate(['login']);
  }
}