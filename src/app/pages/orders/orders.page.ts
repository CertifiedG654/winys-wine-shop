import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { receiptOutline } from 'ionicons/icons';
import { CartService, Order } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class OrdersPage implements OnInit {
  orders: Order[] = [];
  ongoingOrders: Order[] = [];
  completedOrders: Order[] = [];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    public router: Router
  ) {
    addIcons({ receiptOutline });
  }

  ngOnInit(): void {
    this.loadOrders();
    this.cartService.orders$.subscribe(() => this.loadOrders());
  }

  loadOrders() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.orders = [];
      this.ongoingOrders = [];
      this.completedOrders = [];
      return;
    }

    this.orders = this.cartService.getOrdersByCustomer(user.id);
    this.ongoingOrders = this.orders.filter(o => o.status !== 'delivered');
    this.completedOrders = this.orders.filter(o => o.status === 'delivered');
  }

  viewOrder(order: Order) {
    // navigate to order tracking page
    this.router.navigate(['/customer/order-tracking', order.id]);
  }
}
