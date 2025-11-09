import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  IonText,
  IonIcon,
  IonButtons,
  IonMenuButton,
  IonBadge,
  IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, timeOutline, cartOutline } from 'ionicons/icons';
import { CartService, Order } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.page.html',
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
    IonCardContent,
    IonItem,
    IonLabel,
  IonText,
    IonIcon,
    IonButtons,
    IonMenuButton,
    IonBadge,
    IonButton
  ]
})
export class OrderTrackingPage implements OnInit {
  order!: Order;
  orderId!: string;

  trackingSteps = [
    { status: 'pending', label: 'Order Placed', description: 'Your order has been successfully placed and is awaiting processing.' },
    { status: 'processing', label: 'Processing', description: 'Your items are being prepared and packaged by our warehouse team.' },
    { status: 'shipped', label: 'Shipped', description: 'Your order is now with the carrier and on its way to you.' },
    { status: 'out-for-delivery', label: 'Out for Delivery', description: 'It\'s on the truck and will be delivered today!' },
    { status: 'delivered', label: 'Delivered', description: 'Your order has been successfully delivered.' }
  ];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ checkmarkCircleOutline, timeOutline, cartOutline });
  }

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    this.loadOrder();
  }

  loadOrder() {
    const order = this.cartService.getOrderById(this.orderId);
    if (order) {
      this.order = order;
    } else {
      this.router.navigate(['/customer/products']);
    }
  }

  getStepStatus(stepStatus: string): string {
    const currentIndex = this.trackingSteps.findIndex(step => step.status === this.order.status);
    const stepIndex = this.trackingSteps.findIndex(step => step.status === stepStatus);
    
    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'current';
    return 'future';
  }

  getStatusIcon(stepStatus: string): string {
    const status = this.getStepStatus(stepStatus);
    return status === 'complete' ? 'checkmark-circle-outline' : 'time-outline';
  }

  getStatusColor(stepStatus: string): string {
    const status = this.getStepStatus(stepStatus);
    switch (status) {
      case 'complete': return 'success';
      case 'current': return 'primary';
      default: return 'medium';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getLastStatusUpdate(status: string): Date | null {
    const history = this.order.statusHistory.find(h => h.status === status);
    return history ? history.timestamp : null;
  }

  continueShopping() {
    this.router.navigate(['/customer/products']);
  }
}