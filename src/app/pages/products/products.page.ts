import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationStart } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonMenuButton,
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
  ToastController,
  IonModal,
  IonText,
  IonBadge,
  IonSearchbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, logInOutline, logOutOutline, wineOutline, star, starOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService, Product } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styles: [`
    /* Header Styles */
    .header-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cart-button {
      position: relative;
    }

    .cart-badge {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
    }

    @media (max-width: 768px) {
      ion-button {
        --padding-start: 8px;
        --padding-end: 8px;
      }

      .welcome-button {
        display: none;
      }
    }
    .product-image-container {
      width: 100%;
      height: 280px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ffffff;
      padding: 15px;
      border-bottom: 1px solid var(--ion-color-light);
    }

    .product-image {
      width: auto;
      height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
    }

    .product-card {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .pricing {
      padding: 10px;
      text-align: center;
    }

    .pricing .price {
      font-size: 1.5em;
      font-weight: bold;
      color: var(--ion-color-primary);
      margin: 0;
    }

    .card-footer {
      padding: 10px;
      border-top: 1px solid var(--ion-color-light);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .view-details {
      color: var(--ion-color-medium);
      font-style: italic;
    }

    .rating {
      display: flex;
      gap: 2px;
      justify-content: center;
    }

    .wine-type {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9em;
      margin-right: 8px;
    }

    .wine-region {
      color: var(--ion-color-medium);
      font-size: 0.9em;
    }

    /* Modal Styles */
    :host ::ng-deep .product-details-modal {
      --width: 90%;
      --height: 90%;
      --border-radius: 16px;
    }

    @media (min-width: 768px) {
      :host ::ng-deep .product-details-modal {
        --width: 80%;
        --height: 80%;
      }
    }

    @media (min-width: 1200px) {
      :host ::ng-deep .product-details-modal {
        --width: 1000px;
        --height: 700px;
      }
    }

    .product-modal-content {
      height: 100%;
      background: var(--ion-background-color);
    }

    .modal-layout {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 20px;
      padding: 20px;
    }

    @media (min-width: 768px) {
      .modal-layout {
        flex-direction: row;
      }
    }

    .modal-left-section {
      flex: 1;
      min-width: 280px;
    }

    .modal-right-section {
      flex: 1.5;
      padding: 0 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .modal-image-container {
      width: 100%;
      height: 300px;
      overflow: hidden;
      border-radius: 12px;
      background: #ffffff;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    @media (min-width: 768px) {
      .modal-image-container {
        height: 400px;
      }
    }

    .modal-product-image {
      width: auto;
      height: 100%;
      object-fit: contain;
    }

    .product-modal-content h1 {
      font-size: 24px;
      font-weight: bold;
      color: var(--ion-color-dark);
      margin: 0;
      line-height: 1.2;
    }

    .price-tag {
      padding: 12px;
      background: var(--ion-color-light);
      border-radius: 8px;
      text-align: center;
    }

    .price-tag h2 {
      margin: 0;
      font-size: 32px;
      font-weight: bold;
      color: var(--ion-color-primary);
    }

    .wine-details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      background: var(--ion-color-light);
      padding: 16px;
      border-radius: 8px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-item strong {
      color: var(--ion-color-medium);
      font-size: 0.9em;
    }

    .detail-item span {
      color: var(--ion-color-dark);
      font-weight: 500;
    }

    .description, .flavors, .pairings {
      h3 {
        color: var(--ion-color-medium);
        font-size: 1.1em;
        margin-bottom: 8px;
      }

      p {
        color: var(--ion-color-dark);
        line-height: 1.6;
        margin: 0;
      }
    }

    .add-to-cart-button {
      margin-top: auto;
      margin-bottom: 0;
      --padding-top: 16px;
      --padding-bottom: 16px;
    }

    ion-list {
      margin: 20px 0;
    }

    ion-badge {
      margin-left: 8px;
    }

    .description {
      margin: 20px 0;
    }

    .description h3 {
      color: var(--ion-color-medium);
      margin-bottom: 10px;
    }

    .description p {
      line-height: 1.6;
      color: var(--ion-color-dark);
    }

    ion-button {
      margin-top: 20px;
    }

    /* Search Bar Styles */
    .search-bar {
      margin: 16px 12px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .search-results-info {
      padding: 12px 16px;
      text-align: center;
      color: var(--ion-color-medium);
      font-size: 14px;
    }

    .no-results {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
      padding: 20px;
      text-align: center;
      color: var(--ion-color-medium);
    }

    .no-results p {
      margin: 0;
      font-size: 16px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonMenuButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonModal,
    IonText,
    IonBadge,
    IonButtons,
    IonSearchbar
  ]
})
export class ProductsPage {
  public isModalOpen = false;
  public selectedProduct: any = null;

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({logInOutline,cartOutline,logOutOutline,wineOutline,star,starOutline});
  }

  async addToCart(product: Product) {
    if (product.stock <= 0) {
      await this.showToast('This item is out of stock.', 'danger');
      return;
    }

    if (this.authService.isLoggedIn()) {
      const currentItems = this.cartService.getCartItems();
      const itemInCart = currentItems.find(item => item.product.id === product.id);
      const quantityInCart = itemInCart ? itemInCart.quantity : 0;

      if (quantityInCart >= product.stock) {
        await this.showToast(`Only ${product.stock} items are available. You already have ${quantityInCart} in your cart.`, 'warning');
        return;
      }

      this.cartService.addToCart(product);
      await this.showToast(`Added ${product.name} to cart!`, 'success');
      this.closeProductDetails();      
    } else {
      this.closeProductDetails();
      await this.showToast('Please login to add items to cart', 'warning');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 100);
    }
  }

  ngOnInit() {
    this.loadProducts();
    // Subscribe to route changes to ensure modal is closed when navigating
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.closeProductDetails();
      }
    });
  }

  async loadProducts() {
    this.products = await this.productService.getProducts();
    this.filteredProducts = this.products;
  }

  filterProducts(event: any) {
    this.searchQuery = event.detail.value.toLowerCase().trim();
    
    if (!this.searchQuery) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product => {
        const name = product.name.toLowerCase();
        const type = product.type.toLowerCase();
        const region = product.region ? product.region.toLowerCase() : '';
        
        return (
          name.includes(this.searchQuery) ||
          type.includes(this.searchQuery) ||
          region.includes(this.searchQuery)
        );
      });
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredProducts = this.products;
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
    await toast.present();
  }

  openProductDetails(product: any) {
    this.selectedProduct = {
      ...product,
      varietal: this.getVarietal(product.type),
      country: this.getCountry(product.region),
      size: '750ml',
      description: this.getWineDescription(product)
    };
    this.isModalOpen = true;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  closeProductDetails() {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  private getVarietal(type: string): string {
    const varietalMap: { [key: string]: string[] } = {
      'Red': ['Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Syrah'],
      'White': ['Chardonnay', 'Sauvignon Blanc', 'Riesling'],
      'Sparkling': ['Champagne Blend', 'Prosecco'],
      'Rosé': ['Grenache', 'Syrah', 'Mourvèdre']
    };
    const varietals = varietalMap[type] || [];
    return varietals[Math.floor(Math.random() * varietals.length)] || type;
  }

  private getCountry(region: string): string {
    const regionCountryMap: { [key: string]: string } = {
      'Napa Valley': 'USA',
      'Burgundy': 'France',
      'Bordeaux': 'France',
      'Loire Valley': 'France',
      'Oregon': 'USA',
      'Provence': 'France',
      'Rhône Valley': 'France',
      'Mosel': 'Germany',
      'Mendoza': 'Argentina',
      'California': 'USA',
      'Veneto': 'Italy',
      'Champagne': 'France',
      'Rioja': 'Spain',
      'Tuscany': 'Italy',
      'Alsace': 'France',
      'Italy': 'Italy',
      'Australia': 'Australia',
      'South Africa': 'South Africa',
      'Chile': 'Chile',
      'France': 'France',
      'Piedmont': 'Italy',
      'Spain': 'Spain',
      'Rueda': 'Spain',
      'Austria': 'Austria'
    };
    return regionCountryMap[region] || 'Unknown';
  }

  private getWineDescription(product: any): string {
    return `This exceptional ${product.name} from ${product.region} exemplifies the finest qualities of ${product.type.toLowerCase()} wine. Crafted with meticulous attention to detail and a deep respect for traditional winemaking methods, it offers a sophisticated and memorable drinking experience. The wine showcases the unique terroir of ${product.region}, delivering complex flavors and aromas that will delight wine enthusiasts and casual drinkers alike.`;
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

  getCartItems(): any[] {
    return this.cartService.getCartItems();
  }
}