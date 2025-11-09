import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user && user.role === 'admin') {
          return true;
        } else {
          this.router.navigate(['/tabs/products']);
          return false;
        }
      })
    );
  }
}