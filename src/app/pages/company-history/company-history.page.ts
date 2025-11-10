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
  selector: 'app-company-history',
  templateUrl: './company-history.page.html',
  styleUrls: ['./company-history.page.scss'],
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
    IonButtons,
    IonMenuButton
  ]
})
export class CompanyHistoryPage {
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