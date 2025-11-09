import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonTabs, 
  IonTabBar, 
  IonTabButton, 
  IonIcon, 
  IonLabel 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { wineOutline, cartOutline, personOutline, settingsOutline } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
  ]
})
export class TabsPage {

  constructor(private authService: AuthService) {
    addIcons({ wineOutline, cartOutline, personOutline, settingsOutline });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isCustomer(): boolean {
    return this.authService.isCustomer();
  }
}