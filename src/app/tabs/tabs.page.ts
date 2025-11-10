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
import { 
  wineOutline, 
  cartOutline, 
  receiptOutline,
  personOutline, 
  settingsOutline,
  businessOutline,
  informationCircleOutline,
  codeSlashOutline,
  callOutline,
  logOutOutline
} from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
  ]
})
export class TabsPage {

  constructor(private authService: AuthService, private router: Router) {
    addIcons({ 
      wineOutline, 
      cartOutline, 
      receiptOutline,
      personOutline, 
      settingsOutline,
      businessOutline,
      informationCircleOutline,
      codeSlashOutline,
      callOutline,
      logOutOutline
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isCustomer(): boolean {
    return this.authService.isCustomer();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/products']);
  }
}