import { Component, OnInit } from '@angular/core';
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
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';
import { CartService, Order } from 'src/app/services/cart.service';

@Component({
  selector: 'app-sales-analytics',
  templateUrl: './sales-analytics.page.html',
  styleUrls: [],
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
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonButtons,
    IonBackButton
  ]
})
export class SalesAnalyticsPage implements OnInit {
  completedOrders: Order[] = [];
  totalRevenue: number = 0;
  totalOrders: number = 0;
  averageOrderValue: number = 0;
  popularProducts: any[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadAnalytics();
    this.cartService.orders$.subscribe(() => {
      this.loadAnalytics();
    });
  }

  loadAnalytics() {
    const allOrders = this.cartService.getAllOrders();
    this.completedOrders = allOrders.filter(order => order.status === 'delivered' && order.finalPrice);
    this.totalOrders = this.completedOrders.length;
    this.totalRevenue = this.completedOrders.reduce((sum, order) => sum + (order.finalPrice || 0), 0);
    this.averageOrderValue = this.totalOrders > 0 ? this.totalRevenue / this.totalOrders : 0;
    this.calculatePopularProducts();
  }

  calculatePopularProducts() {
    const productSales: { [key: string]: { product: any, quantity: number, revenue: number } } = {};

    this.completedOrders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product.id;
        if (!productSales[productId]) {
          productSales[productId] = {
            product: item.product,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += item.product.price * item.quantity;
      });
    });

    this.popularProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toFixed(2);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}