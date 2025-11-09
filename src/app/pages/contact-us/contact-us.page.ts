import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonMenu,
  IonList,
  IonItem as IonItemCmp,
  IonLabel as IonLabelCmp,
  IonMenuToggle,
  IonIcon as IonIconCmp,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonButtons,
  IonMenuButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  callOutline, 
  locationOutline, 
  timeOutline, 
  mailOutline,
  logoFacebook,
  logoInstagram,
  logoTwitter,
  receiptOutline,
  wineOutline,
  cartOutline,
  businessOutline,
  informationCircleOutline,
  codeSlashOutline,
  callOutline as callOutlineIcon,
  logOutOutline
} from 'ionicons/icons';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonMenu,
    IonList,
    IonItemCmp,
    IonLabelCmp,
    IonMenuToggle,
    IonIconCmp,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonButtons,
    IonMenuButton
  ]
})
export class ContactUsPage {
  constructor(private authService: AuthService, private router: Router) {
    addIcons({ 
      callOutline, 
      locationOutline, 
      timeOutline, 
      mailOutline,
      logoFacebook,
      logoInstagram,
      logoTwitter,
      receiptOutline,
      wineOutline,
      cartOutline,
      businessOutline,
      informationCircleOutline,
      codeSlashOutline,
      callOutlineIcon,
      logOutOutline
    });
  }

  callStore() {
    window.open('tel:+639763100213', '_self');
  }

  openMap() {
    window.open('https://maps.google.com/?q=Cubao+Quezon+City+Philippines', '_blank');
  }

  sendEmail() {
    window.open('mailto:info@winysstore.com', '_self');
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/products']);
  }
}