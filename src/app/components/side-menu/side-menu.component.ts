import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { 
  IonMenu, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonIcon,
  IonAvatar,
  IonMenuToggle,
  IonButtons,
  IonMenuButton
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
  logOutOutline
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
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonAvatar,
    IonMenuToggle,
    IonButtons,
    IonMenuButton
  ]
})
export class SideMenuComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    addIcons({ 
      personOutline, 
      wineOutline, 
      cartOutline, 
      businessOutline, 
      informationCircleOutline, 
      codeSlashOutline, 
      callOutline,
      logOutOutline
    });
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
    return user?.contactNumber || 'No contact number';
  }

  getProfileImage(): string {
    const user = this.authService.getCurrentUser();
    return user?.profileImage || '';
  }
}