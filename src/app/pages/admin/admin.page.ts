import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonIcon, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonButtons, 
  IonButton 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cubeOutline, peopleOutline, barChartOutline, settingsOutline, logOutOutline, cartOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: [],
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
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonButtons,
    IonButton
  ]
})
export class AdminPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ cubeOutline, peopleOutline, barChartOutline, settingsOutline, logOutOutline, cartOutline });
  }

  ngOnInit() {}

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToOrders() {
    this.router.navigate(['/admin-orders']);
  }

  navigateToAnalytics() {
    this.router.navigate(['/sales-analytics']);
  }
}