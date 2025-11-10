import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonList as IonListCmp,
  IonItem as IonItemCmp,
  IonLabel as IonLabelCmp,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonButtons,
  IonMenuButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  shieldCheckmarkOutline, 
  rocketOutline, 
  heartOutline, 
  starOutline,
  cartOutline,
  personOutline, wineOutline, codeSlashOutline,
  businessOutline, informationCircleOutline, callOutline, logOutOutline,
  receiptOutline
} from 'ionicons/icons';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-about-app',
  templateUrl: './about-app.page.html',
  styleUrls: ['./about-app.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonListCmp,
    IonItemCmp,
    IonLabelCmp,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonButtons,
    IonMenuButton
  ]
})
export class AboutAppPage {
  constructor(private authService: AuthService, private router: Router) {
    addIcons({
      rocketOutline,starOutline,wineOutline,cartOutline,personOutline,
      shieldCheckmarkOutline,heartOutline,codeSlashOutline,
      businessOutline, informationCircleOutline, callOutline, logOutOutline,
      receiptOutline
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/products']);
  }
}