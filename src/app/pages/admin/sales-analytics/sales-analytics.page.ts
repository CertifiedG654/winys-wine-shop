import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentOutline, documentTextOutline } from 'ionicons/icons';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CartService, Order } from 'src/app/services/cart.service';

@Component({
  selector: 'app-sales-analytics',
  templateUrl: './sales-analytics.page.html',
  styleUrls: [],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton
  ]
})
export class SalesAnalyticsPage implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChartCanvas!: ElementRef;
  @ViewChild('productsChart') productsChartCanvas!: ElementRef;
  
  salesChart: Chart | undefined;
  productsChart: Chart | undefined;
  dateRange: string = 'daily';
  completedOrders: Order[] = [];
  totalRevenue: number = 0;
  totalOrders: number = 0;
  averageOrderValue: number = 0;
  popularProducts: any[] = [];

  constructor(private cartService: CartService) {
    addIcons({ documentOutline, documentTextOutline });
  }

  ngOnInit() {
    this.loadAnalytics();
    this.cartService.orders$.subscribe(() => {
      this.loadAnalytics();
    });
  }

  ngAfterViewInit() {
    this.initializeCharts();
  }

  loadAnalytics() {
    const allOrders = this.cartService.getAllOrders();
    this.completedOrders = allOrders.filter(order => order.status === 'delivered' && order.finalPrice);
    this.totalOrders = this.completedOrders.length;
    this.totalRevenue = this.completedOrders.reduce((sum, order) => sum + (order.finalPrice || 0), 0);
    this.averageOrderValue = this.totalOrders > 0 ? this.totalRevenue / this.totalOrders : 0;
    this.calculatePopularProducts();
    this.updateCharts();
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

  initializeCharts() {
    // Sales Trend Chart
    this.salesChart = new Chart(this.salesChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Sales',
          data: [],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Product Performance Chart
    this.productsChart = new Chart(this.productsChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Products Sold',
          data: [],
          backgroundColor: 'rgb(54, 162, 235)',
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    this.updateCharts();
  }

  updateCharts() {
    if (!this.completedOrders || !this.salesChart || !this.productsChart) return;

    const today = new Date();
    let groupedData: Map<string, number> = new Map();
    let productData: Map<string, number> = new Map();

    // Process orders based on date range
    this.completedOrders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      let dateKey: string;

      // Generate date key based on selected range
      switch (this.dateRange) {
        case 'monthly':
          dateKey = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;
          break;
        case 'weekly':
          const week = Math.floor(((orderDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000) + today.getDay() + 1) / 7);
          dateKey = `Week ${week}`;
          break;
        default: // daily
          dateKey = orderDate.toISOString().split('T')[0];
      }

      // Aggregate sales data
      groupedData.set(dateKey, (groupedData.get(dateKey) || 0) + (order.finalPrice || 0));

      // Aggregate product data
      order.items.forEach(item => {
        productData.set(item.product.name, (productData.get(item.product.name) || 0) + item.quantity);
      });
    });

    // Sort dates chronologically
    const sortedDates = Array.from(groupedData.keys()).sort();

    // Update Sales Chart
    this.salesChart.data.labels = sortedDates;
    this.salesChart.data.datasets[0].data = sortedDates.map(date => groupedData.get(date) || 0);
    this.salesChart.update();

    // Sort products by quantity sold
    const sortedProducts = Array.from(productData.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Show top 10 products

    // Update Products Chart
    this.productsChart.data.labels = sortedProducts.map(([name]) => name);
    this.productsChart.data.datasets[0].data = sortedProducts.map(([_, quantity]) => quantity);
    this.productsChart.update();
  }

  onDateRangeChange() {
    this.updateCharts();
  }

  exportToExcel() {
    const data = this.prepareExportData();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Data');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(dataBlob, `sales-report-${new Date().toISOString()}.xlsx`);
  }

  exportToCSV() {
    const data = this.prepareExportData();
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `sales-report-${new Date().toISOString()}.csv`);
  }

  private prepareExportData() {
    return this.completedOrders.map(order => ({
      'Order ID': order.id,
      'Date': new Date(order.createdAt).toLocaleDateString(),
      'Customer': order.customerName,
      'Items': order.items.map(item => `${item.product.name} (${item.quantity})`).join(', '),
      'Total': this.formatCurrency(order.finalPrice || 0)
    }));
  }

  private convertToCSV(data: any[]) {
    const header = Object.keys(data[0]);
    const rows = data.map(obj => header.map(key => obj[key]));
    return [
      header.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  }

  formatCurrency(amount: number): string {
    return '₱' + amount.toFixed(2);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}