import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonButtons,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, logInOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: [],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonButtons
  ]
})
export class ProductsPage {
  products = [
    { id: 1, name: 'Cabernet Sauvignon', price: 29.99, type: 'Red', region: 'Napa Valley' },
    { id: 2, name: 'Chardonnay', price: 24.99, type: 'White', region: 'Burgundy' },
    { id: 3, name: 'Merlot', price: 26.99, type: 'Red', region: 'Bordeaux' },
    { id: 4, name: 'Sauvignon Blanc', price: 22.99, type: 'White', region: 'Loire Valley' },
    { id: 5, name: 'Pinot Noir', price: 32.99, type: 'Red', region: 'Oregon' },
    { id: 6, name: 'Rosé', price: 19.99, type: 'Rosé', region: 'Provence' },
    { id: 7, name: 'Syrah', price: 27.99, type: 'Red', region: 'Rhône Valley' },
    { id: 8, name: 'Riesling', price: 21.99, type: 'White', region: 'Mosel' },
    { id: 9, name: 'Malbec', price: 25.99, type: 'Red', region: 'Mendoza' },
    { id: 10, name: 'Zinfandel', price: 23.99, type: 'Red', region: 'California' },
    { id: 11, name: 'Prosecco', price: 18.99, type: 'Sparkling', region: 'Veneto' },
    { id: 12, name: 'Champagne', price: 49.99, type: 'Sparkling', region: 'Champagne' },
    { id: 13, name: 'Tempranillo', price: 24.99, type: 'Red', region: 'Rioja' },
    { id: 14, name: 'Sangiovese', price: 26.99, type: 'Red', region: 'Tuscany' },
    { id: 15, name: 'Gewürztraminer', price: 23.99, type: 'White', region: 'Alsace' },
    { id: 16, name: 'Pinot Grigio', price: 20.99, type: 'White', region: 'Italy' },
    { id: 17, name: 'Shiraz', price: 28.99, type: 'Red', region: 'Australia' },
    { id: 18, name: 'Chenin Blanc', price: 19.99, type: 'White', region: 'South Africa' },
    { id: 19, name: 'Carménère', price: 25.99, type: 'Red', region: 'Chile' },
    { id: 20, name: 'Viognier', price: 22.99, type: 'White', region: 'France' },
    { id: 21, name: 'Nebbiolo', price: 34.99, type: 'Red', region: 'Piedmont' },
    { id: 22, name: 'Grenache', price: 23.99, type: 'Red', region: 'Spain' },
    { id: 23, name: 'Verdejo', price: 21.99, type: 'White', region: 'Rueda' },
    { id: 24, name: 'Moscato', price: 17.99, type: 'White', region: 'Italy' },
    { id: 25, name: 'Barbera', price: 22.99, type: 'Red', region: 'Italy' },
    { id: 26, name: 'Albariño', price: 24.99, type: 'White', region: 'Spain' },
    { id: 27, name: 'Cabernet Franc', price: 27.99, type: 'Red', region: 'France' },
    { id: 28, name: 'Grüner Veltliner', price: 23.99, type: 'White', region: 'Austria' },
    { id: 29, name: 'Petit Verdot', price: 29.99, type: 'Red', region: 'France' },
    { id: 30, name: 'Semillon', price: 20.99, type: 'White', region: 'Australia' }
  ];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ cartOutline, logInOutline, logOutOutline });
  }

  addToCart(product: any) {
    if (this.authService.isLoggedIn()) {
      this.cartService.addToCart(product);
      this.showToast(`Added ${product.name} to cart!`, 'success');
    } else {
      this.showToast('Please login to add items to cart', 'warning');
      this.router.navigate(['/login']);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.router.navigate(['/tabs/profile']);
  }

  goToCart() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/customer/cart']);
    } else {
      this.showToast('Please login to view cart', 'warning');
      this.router.navigate(['/login']);
    }
  }

  async logout() {
    await this.authService.logout();
    this.showToast('Logged out successfully!', 'success');
    this.router.navigate(['/products']);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    toast.present();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  getCartItemCount(): number {
    return this.cartService.getCartItemCount();
  }
}