import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { Location } from '@angular/common';
import { ProductService, Product } from 'src/app/services/product.service';

@Component({
  selector: 'app-stock-inventory',
  templateUrl: './stock-inventory.page.html',
  styleUrls: ['./stock-inventory.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})
export class StockInventoryPage implements OnInit {
  products: Product[] = [];

  constructor(
    private location: Location,
    private productService: ProductService,
    private alertController: AlertController
  ) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    this.products = await this.productService.getProducts();
  }

  goBack() {
    this.location.back();
  }

  async onStockChange(product: Product, newStockValue: string | number | null | undefined) {
    const newStock = Number(newStockValue);

    if (isNaN(newStock) || newStock < 0) {
      console.error('Invalid stock value');
      // Optionally, reset the input to the original value if the new one is invalid
      this.loadProducts(); 
      return;
    }

    if (product.stock === newStock) {
      // No change, no need to show confirmation
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirm Stock Update',
      message: `Are you sure you want to update the stock for <strong>${product.name}</strong> from ${product.stock} to <strong>${newStock}</strong>?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Optional: Revert input change if canceled
            this.loadProducts();
          }
        },
        {
          text: 'Update',
          handler: () => {
            this.updateStock(product, newStock);
          }
        }
      ]
    });

    await alert.present();
  }

  private async updateStock(product: Product, newStock: number) {
    await this.productService.updateProductStock(product.id, newStock);
    // Refresh the product list to reflect the change immediately
    this.loadProducts();
  }

  getStockColor(stock: number): string {
    if (stock <= 10) {
      return 'danger'; // Red for critical low stock
    } else if (stock > 10 && stock < 30) {
      return 'warning'; // Yellow for low stock
    } else {
      return 'success'; // Green for sufficient stock
    }
  }
}
