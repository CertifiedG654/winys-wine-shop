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
  IonItem,
  IonLabel,
  IonIcon,
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
  logoTwitter
} from 'ionicons/icons';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonButtons,
    IonMenuButton
  ]
})
export class ContactUsPage {
  constructor() {
    addIcons({ 
      callOutline, 
      locationOutline, 
      timeOutline, 
      mailOutline,
      logoFacebook,
      logoInstagram,
      logoTwitter
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
}