import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonAvatar,
  IonButtons,
  IonMenuButton
} from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { 
  wineOutline,
  cartOutline,
  receiptOutline,
  businessOutline,
  informationCircleOutline,
  codeSlashOutline,
  callOutline,
  logOutOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-developers',
  templateUrl: './developers.page.html',
  styleUrls: ['./developers.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonAvatar,
    IonButtons,
    IonMenuButton
  ]
})
export class DevelopersPage {
  constructor(private authService: AuthService, private router: Router) {
    addIcons({
      wineOutline,
      cartOutline,
      receiptOutline,
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
}