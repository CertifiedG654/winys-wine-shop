import { Component, ViewChild, ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { 
  IonMenu, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonRouterOutlet,
  IonList, 
  IonItem, 
  IonLabel, 
  IonIcon,
  IonAvatar,
  IonMenuToggle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  wineOutline, 
  cartOutline, 
  businessOutline, 
  informationCircleOutline, 
  codeSlashOutline, 
  callOutline,
  receiptOutline,
  logOutOutline,
  barChartOutline,
  peopleOutline,
  bagCheckOutline,
  cubeOutline,
  logInOutline
} from 'ionicons/icons';
import { AuthService, User } from 'src/app/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRouterOutlet,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonAvatar,
    IonMenuToggle,
  ]
})
export class SideMenuComponent implements OnInit, AfterViewInit {
  @ViewChild('menu') menu: IonMenu | undefined;

  constructor(
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({personOutline,callOutline,wineOutline,cartOutline,receiptOutline,businessOutline,informationCircleOutline,codeSlashOutline,bagCheckOutline,peopleOutline,barChartOutline,logOutOutline, cubeOutline, logInOutline});
  }

  ngOnInit() {
    // Close menu on successful navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenuSafely();
      });
  }

  ngAfterViewInit() {
    // Trigger change detection to ensure menu reference is properly initialized
    this.cdr.detectChanges();
  }

  closeMenuSafely() {
    if (this.menu) {
      try {
        this.menu.close();
      } catch (error) {
        console.warn('Error closing menu:', error);
      }
    }
  }

  async logout() {
    this.closeMenuSafely();
    await this.authService.logout();
    this.router.navigate(['/products']);
  }

  getFullName(): string {
    const user = this.authService.getCurrentUser();
    return user ? `${user.firstName} ${user.lastName}` : 'Guest';
  }

  getContactNumber(): string {
    const user = this.authService.getCurrentUser();
    return user?.contactNumber || '';
  }

  getProfileImage(): string {
    const user = this.authService.getCurrentUser();
    return user?.profileImage || '';
  }

  isAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'admin';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}