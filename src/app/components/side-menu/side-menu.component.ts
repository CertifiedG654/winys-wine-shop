import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
export class SideMenuComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    addIcons({personOutline,callOutline,wineOutline,cartOutline,receiptOutline,businessOutline,informationCircleOutline,codeSlashOutline,bagCheckOutline,peopleOutline,barChartOutline,logOutOutline, cubeOutline, logInOutline});
  }

  async logout() {
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