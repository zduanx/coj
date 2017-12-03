// follow  https://www.youtube.com/watch?v=i_dHFvi1BJc&t=1913s

import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private auth: AuthService,
        private router: Router
    ){}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        if(this.auth.isAuthenticated()){
            return true;
        }
        else{
            console.log('BLOCKED BY AUTH GUARD');
            this.router.navigate(['/not-found'])
            return false;
        }
    }
}