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
  IonList,
  IonItem,
  IonLabel,
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
  personOutline, wineOutline, codeSlashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-about-app',
  templateUrl: './about-app.page.html',
  styleUrls: ['./about-app.page.scss'],
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
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButtons,
    IonMenuButton
  ]
})
export class AboutAppPage {
  constructor() {
    addIcons({rocketOutline,starOutline,wineOutline,cartOutline,personOutline,shieldCheckmarkOutline,heartOutline,codeSlashOutline});
  }
}