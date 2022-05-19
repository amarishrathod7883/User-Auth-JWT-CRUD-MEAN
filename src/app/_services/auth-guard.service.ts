import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public TokenStorageService: TokenStorageService, public router: Router) {}

  canActivate(): boolean {
    if (this.TokenStorageService.getToken()) {
      // logged in so return true
      return true;
    }
    // not logged in so redirect to login page
    this.router.navigate(['login']);
    return false;
  }  
}
