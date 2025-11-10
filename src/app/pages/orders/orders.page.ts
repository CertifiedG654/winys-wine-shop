import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  ToastController
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
    IonButtons,
    IonMenuButton,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonButton,
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
  private previousStatusById: { [orderId: string]: Order['status'] } = {};

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    public router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ receiptOutline });
  }

  ngOnInit(): void {
    this.loadOrders();
    this.cartService.orders$.subscribe(() => {
      this.detectStatusChanges();
      this.loadOrders();
    });
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

    // update previous statuses after load
    this.orders.forEach(o => this.previousStatusById[o.id] = o.status);
  }

  viewOrder(order: Order) {
    // navigate to order tracking page
    this.router.navigate(['/customer/order-tracking', order.id]);
  }

  private detectStatusChanges() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const latestOrders = this.cartService.getOrdersByCustomer(user.id);
    for (const order of latestOrders) {
      const prev = this.previousStatusById[order.id];
      if (prev && prev !== order.status) {
        this.showToast(`Order ${order.id} updated to ${order.status.toUpperCase()}`, 'primary');
      }
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}
