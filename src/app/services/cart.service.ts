import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  product: any;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerContact: string;
  customerAddress: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered';
  createdAt: Date;
  statusHistory: StatusHistory[];
  assignedCashier?: string;
  finalPrice?: number;
}

export interface StatusHistory {
  status: string;
  timestamp: Date;
  note?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private orders = new BehaviorSubject<Order[]>([]);
  
  public cartItems$ = this.cartItems.asObservable();
  public orders$ = this.orders.asObservable();

  constructor() {
    this.loadCartFromStorage();
    this.loadOrdersFromStorage();
  }

  // Cart Management
  addToCart(product: any, quantity: number = 1) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }
    
    this.cartItems.next(currentItems);
    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.product.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.cartItems.next(currentItems);
        this.saveCartToStorage();
      }
    }
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.value.filter(item => item.product.id !== productId);
    this.cartItems.next(currentItems);
    this.saveCartToStorage();
  }

  clearCart() {
    this.cartItems.next([]);
    this.saveCartToStorage();
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getCartItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }

  private saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }

  private loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  // Order Management
  createOrder(customer: any, items: CartItem[]): Order {
    const order: Order = {
      id: this.generateOrderId(),
      customerId: customer.id,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      customerContact: customer.contactNumber,
      customerAddress: customer.address,
      items: [...items],
      total: this.getCartTotal(),
      status: 'pending',
      createdAt: new Date(),
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date(),
          note: 'Order placed successfully'
        }
      ]
    };

    const currentOrders = this.orders.value;
    currentOrders.push(order);
    this.orders.next(currentOrders);
    this.saveOrdersToStorage();
    
    // Clear cart after order
    this.clearCart();
    
    return order;
  }

  updateOrderStatus(orderId: string, status: Order['status'], note?: string) {
    const currentOrders = this.orders.value;
    const order = currentOrders.find(o => o.id === orderId);
    
    if (order) {
      order.status = status;
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note
      });
      
      this.orders.next(currentOrders);
      this.saveOrdersToStorage();
    }
  }

  assignCashier(orderId: string, cashierName: string) {
    const currentOrders = this.orders.value;
    const order = currentOrders.find(o => o.id === orderId);
    
    if (order) {
      order.assignedCashier = cashierName;
      this.orders.next(currentOrders);
      this.saveOrdersToStorage();
    }
  }

  completeOrder(orderId: string, finalPrice: number) {
    const currentOrders = this.orders.value;
    const order = currentOrders.find(o => o.id === orderId);
    
    if (order) {
      order.finalPrice = finalPrice;
      order.status = 'delivered';
      order.statusHistory.push({
        status: 'delivered',
        timestamp: new Date(),
        note: `Order completed with final price: ₱${finalPrice}`
      });
      
      this.orders.next(currentOrders);
      this.saveOrdersToStorage();
    }
  }

  getOrdersByCustomer(customerId: number): Order[] {
    return this.orders.value.filter(order => order.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllOrders(): Order[] {
    return this.orders.value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders.value.find(order => order.id === orderId);
  }

  private generateOrderId(): string {
    return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  private saveOrdersToStorage() {
    localStorage.setItem('orders', JSON.stringify(this.orders.value));
  }

  private loadOrdersFromStorage() {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      this.orders.next(JSON.parse(savedOrders));
    }
  }
}