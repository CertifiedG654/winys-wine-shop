import { Component, OnInit } from '@angular/core';
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
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonList,
  IonButtons,
  IonMenuButton,
  ToastController,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, removeOutline, trashOutline, cartOutline } from 'ionicons/icons';
import { CartService, CartItem } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
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
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonList,
    IonButtons,
    IonMenuButton,
    IonText
  ]
})
export class CartPage implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ addOutline, removeOutline, trashOutline, cartOutline });
  }

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  increaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    }
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.product.id);
    this.showToast(`${item.product.name} removed from cart`, 'warning');
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  placeOrder() {
    if (this.cartItems.length === 0) {
      this.showToast('Your cart is empty', 'warning');
      return;
    }

    const customer = this.authService.getCurrentUser();
    if (customer) {
      const order = this.cartService.createOrder(customer, this.cartItems);
      this.showToast('Order placed successfully!', 'success');
      this.router.navigate(['/customer/order-tracking', order.id]);
    }
  }

  continueShopping() {
    this.router.navigate(['/customer/products']);
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

  getCartItemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }
}