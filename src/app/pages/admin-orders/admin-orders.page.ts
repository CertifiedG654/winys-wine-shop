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
  IonBadge,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButtons,
  IonBackButton,
  ToastController,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline, timeOutline, cartOutline, cashOutline } from 'ionicons/icons';
import { CartService, Order } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.page.html',
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
    IonBadge,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButtons,
    IonBackButton,
    IonText
  ]
})
export class AdminOrdersPage implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus: string = 'all';
  cashierName: string = 'Admin';
  finalPrices: { [key: string]: number } = {};

  statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' }
  ];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    addIcons({ checkmarkOutline, timeOutline, cartOutline, cashOutline });
  }

  ngOnInit() {
    this.loadOrders();
    this.cartService.orders$.subscribe(orders => {
      this.orders = orders;
      this.filterOrders();
    });
  }

  loadOrders() {
    this.orders = this.cartService.getAllOrders();
    this.filterOrders();
  }

  filterOrders() {
    if (this.selectedStatus === 'all') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    }
  }

  onStatusChange() {
    this.filterOrders();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'primary';
      case 'shipped': return 'secondary';
      case 'out-for-delivery': return 'tertiary';
      case 'delivered': return 'success';
      default: return 'medium';
    }
  }

  updateOrderStatus(order: Order, newStatus: Order['status']) {
    const note = `Status updated by ${this.cashierName}`;
    this.cartService.updateOrderStatus(order.id, newStatus, note);
    
    if (newStatus === 'processing') {
      this.cartService.assignCashier(order.id, this.cashierName);
    }
    
    this.showToast(`Order ${order.id} status updated to ${newStatus}`, 'success');
  }

  completeOrder(order: Order) {
    const finalPrice = this.finalPrices[order.id] || order.total;
    if (finalPrice <= 0) {
      this.showToast('Please enter a valid final price', 'warning');
      return;
    }

    this.cartService.completeOrder(order.id, finalPrice);
    delete this.finalPrices[order.id];
    this.showToast(`Order ${order.id} completed successfully!`, 'success');
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getOrderItemsCount(order: Order): number {
    return order.items.reduce((count, item) => count + item.quantity, 0);
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
}