import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  type: string;
  varietal: string;
  country: string;
  size: string;
  description: string;
  image: string;
  region?: string;
  abv?: string;
  vintage?: string;
  flavors?: string;
  pairings?: string;
  stock: number; // New stock property
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    // Your existing 30 products will go here.
    // I'll add the 'stock' property to each.
    { id: 1, name: 'Yellow Tail - Cabernet Sauvignon - 187ml Miniature', price: 249, type: 'Red', varietal: 'Merlot', country: 'Australia', size: '750ml', description: 'This Yellow Tail Cabernet Sauvignon is everything a great wine should be – vibrant, velvety, rich and easy to drink.', image: 'assets/images/wines/Yellow Tail - Cabernet Sauvignon.jpg', stock: 10 },
    { id: 2, name: 'Yellow Tail - Chardonnay - 187ml Miniature', price: 249, type: 'White', varietal: 'Chardonnay', country: 'Australia', size: '750ml', description: 'This Yellow Tail Chardonnay is everything a great wine should be - vibrant, flavoursome, fresh and easy to drink.', image: 'assets/images/wines/Yellow Tail - Chardonnay - 187ml Miniature.jpg', stock: 15 },
    { id: 3, name: 'Yellow Tail - Pure Bright Pinot Grigio', price: 689, type: 'White', varietal: '100% Pinot Grigio', abv: '8.5%', vintage: '2021', country: 'Australia', region: 'South Eastern Australia', size: '750ml', description: 'Pinot Grigio is not only great drinking, it\'s also an excellent match for food. Pure Bright Pinot Grigio is an 8.5% alcohol wine with a light and refreshing flavour.', flavors: 'Light and refreshing, bursting with apple, pear, and passionfruit flavours', pairings: 'Enjoy with Asian inspired food on a warm summer evening', image: 'assets/images/wines/Yellow Tail - Pure Bright Pinot Grigio.jpg', stock: 20 },
    { id: 4, name: 'Yellow Tail - Red Moscato', price: 689, type: 'Red', varietal: 'Moscato', abv: '8.5%', country: 'Australia', size: '750ml', description: 'Zingy and refreshing, bursting with strawberry, raspberry and cherry flavors.', image: 'assets/images/wines/Yellow Tail - Red Moscato.jpg', stock: 5 },
    { id: 5, name: 'Yellow Tail - Chardonnay', price: 1290, type: 'White', varietal: 'Chardonnay', country: 'Chile', region: 'Maipo Valley', vintage: '2022', size: '750ml', description: 'Bright greenish yellow in colour. The nose is mature with gentle nuts of nuts and citurs and a subtle hint of oak. The palate is full bidied and deliciously ripe with great acidity and a medium finish.', flavors: 'Peaches, Melon and a Touch of Vanilla', pairings: 'With Seafood, Sunshine and Great Friends', image: 'assets/images/wines/De Martino - Legado - Reserva - Chardonnay.jpg', stock: 8 },
    { id: 6, name: 'Yellow Tail - Bubbles Sparkling Rosé', price: 689, type: 'Rosé', varietal: 'Blend', abv: '11.5%', vintage: 'NV', country: 'Australia', region: 'South Eastern Australia', size: '750ml', description: 'This sparkling rosé is a celebration in a bottle. Fresh and vibrant with a delicate pink hue, it offers an enchanting blend of strawberry and cherry flavors with a crisp, refreshing finish.', flavors: 'Strawberry, Cherry, and Red Berries', pairings: 'Perfect for celebrations, appetizers, or light desserts', image: 'assets/images/wines/Yellow Tail - Bubbles Sparkling Rosé.jpg', stock: 12 },
    { id: 7, name: 'Yellow Tail - Reserve - Cabernet Sauvignon', price: 1499, type: 'Red', varietal: 'Cabernet Sauvignon', abv: '13.5%', vintage: '2021', country: 'Australia', region: 'South Eastern Australia', size: '750ml', description: 'A premium selection from Yellow Tail\'s reserve collection, this Cabernet Sauvignon showcases rich flavors of blackberry and cassis with hints of oak and vanilla.', flavors: 'Blackberry, Cassis, Oak, and Vanilla', pairings: 'Excellent with red meat dishes and aged cheeses', image: 'assets/images/wines/Yellow Tail - Reserve - Cabernet Sauvignon.jpg', stock: 7 },
    { id: 8, name: 'Yellow Tail - Merlot', price: 899, type: 'Red', varietal: 'Merlot', abv: '13.5%', vintage: '2022', country: 'Australia', region: 'South Eastern Australia', size: '1.5L', description: 'A smooth and velvety Merlot that delivers plush fruit flavors and a soft, satisfying finish. Perfect for casual dining and everyday enjoyment.', flavors: 'Plum, Cherry, and Chocolate notes', pairings: 'Versatile - pairs well with pasta, pizza, and grilled meats', image: 'assets/images/wines/Yellow Tail - Merlot - 1.5L.jpg', stock: 10 },
    { id: 9, name: 'Yellow Tail - Moscato', price: 899, type: 'White', varietal: 'Moscato', abv: '7.5%', vintage: '2023', country: 'Australia', region: 'South Eastern Australia', size: '1.5L', description: 'Sweet and refreshing, this Moscato delights with its light, crisp character and natural fruit sweetness. Perfect for those who prefer a sweeter wine style.', flavors: 'Peach, Citrus, and Fresh Grape', pairings: 'Great with spicy foods, fruit desserts, or as an aperitif', image: 'assets/images/wines/Yellow Tail - Moscato - 1.5L.jpg', stock: 18 },
    { id: 10, name: 'Yellow Tail - Shiraz', price: 899, type: 'Red', varietal: 'Shiraz', abv: '13.5%', vintage: '2022', country: 'Australia', region: 'South Eastern Australia', size: '1.5L', description: 'Bold and flavorful, this Shiraz exemplifies Australian winemaking at its best. Rich with dark fruit flavors and a hint of spice.', flavors: 'Blackberry, Pepper, and Dark Chocolate', pairings: 'Perfect with barbecued meats and strong cheeses', image: 'assets/images/wines/Yellow Tail - Shiraz - 1.5L.jpg', stock: 0 },
    { id: 11, name: 'Codorníu - Rosado Brut Cava', price: 1299, type: 'Sparkling', varietal: 'Traditional Cava Blend', abv: '11.5%', vintage: 'NV', country: 'Spain', region: 'Penedès', size: '750ml', description: 'A beautiful rosé cava that combines freshness with elegant complexity. Made using the traditional method, it offers delightful bubbles and refined character.', flavors: 'Red Berries, Citrus, and Fresh Bread', pairings: 'Ideal for tapas, seafood, and celebrations', image: 'assets/images/wines/Codorníu - Rosado Brut Cava.jpg', stock: 9 },
    { id: 12, name: 'Codorníu - Brut Cava', price: 1199, type: 'Sparkling', varietal: 'Macabeo, Parellada, Xarel·lo', abv: '11.5%', vintage: 'NV', country: 'Spain', region: 'Penedès', size: '750ml', description: 'A classic Spanish cava that exemplifies the traditional method of sparkling wine production. Crisp, refreshing, and elegantly balanced.', flavors: 'Green Apple, Citrus, and Brioche', pairings: 'Perfect for aperitifs and light dishes', image: 'assets/images/wines/Codorníu - Brut Cava.jpg', stock: 11 },
    { id: 13, name: 'Codorníu - Anna De Codorníu - Brut Cava', price: 1499, type: 'Sparkling', varietal: 'Chardonnay Blend', abv: '11.5%', vintage: 'NV', country: 'Spain', region: 'Penedès', size: '750ml', description: 'Named after the last Codorníu to bear the family name, this premium cava represents the perfect marriage of traditional and modern winemaking.', flavors: 'White Flowers, Apple, and Toast', pairings: 'Excellent with seafood and light pasta dishes', image: 'assets/images/wines/Codorníu - Anna De Codorníu - Brut Cava.jpg', stock: 14 },
    { id: 14, name: 'Codorníu - Anna de Codorníu - Ice Edition', price: 1599, type: 'Sparkling', varietal: 'Chardonnay Blend', abv: '11.5%', vintage: 'NV', country: 'Spain', region: 'Penedès', size: '750ml', description: 'A special edition cava designed to be served over ice. Extra dosage provides perfect balance when chilled with ice, creating a unique summer drinking experience.', flavors: 'Tropical Fruit, Honey, and Vanilla', pairings: 'Serve over ice with fresh fruit garnish', image: 'assets/images/wines/Codorníu - Anna de Codorníu - Ice Edition Cava.jpg', stock: 6 },
    { id: 15, name: 'Codorníu - Anna de Codorníu - Brut Rosé', price: 1499, type: 'Sparkling Rosé', varietal: 'Pinot Noir', abv: '12%', vintage: 'NV', country: 'Spain', region: 'Penedès', size: '750ml', description: 'An elegant rosé cava made primarily from Pinot Noir. Displays a beautiful pink color and refined bubbles with delicate red fruit characteristics.', flavors: 'Strawberry, Rose Petals, and Cream', pairings: 'Great with light appetizers and desserts', image: 'assets/images/wines/Codorníu - Anna de Codorníu - Brut Rosé.jpg', stock: 9 },
    { id: 16, name: 'Elderton - E Series Chardonnay', price: 1299, type: 'White', varietal: 'Chardonnay', abv: '13%', vintage: '2022', country: 'Australia', region: 'Barossa', size: '750ml', description: 'A fresh and vibrant Chardonnay from the renowned Elderton estate. Shows beautiful fruit expression with subtle oak influence.', flavors: 'Peach, Citrus, and Light Oak', pairings: 'Pairs well with poultry and creamy pasta', image: 'assets/images/wines/Elderton - E Series Chardonnay.jpg', stock: 13 },
    { id: 17, name: 'Elderton - Golden Sémillon', price: 2499, type: 'White', varietal: 'Sémillon', abv: '11%', vintage: '2021', country: 'Australia', region: 'Barossa', size: '750ml', description: 'A special release from Elderton showcasing the unique character of aged Sémillon. Rich and complex with beautiful honeyed notes.', flavors: 'Honey, Citrus Peel, and Toast', pairings: 'Excellent with rich seafood dishes', image: 'assets/images/wines/Elderton - Golden Sémillon.jpg', stock: 4 },
    { id: 18, name: 'Elderton - Ode To Lorraine', price: 3499, type: 'Red', varietal: 'Cabernet Sauvignon, Shiraz, Merlot', abv: '14.5%', vintage: '2020', country: 'Australia', region: 'Barossa', size: '750ml', description: 'A premium blend named after co-founder Lorraine Ashmead. This wine represents the best of Barossa Valley red wine making.', flavors: 'Black Fruits, Spice, and Oak', pairings: 'Perfect with prime cuts of beef', image: 'assets/images/wines/Elderton - Ode To Lorraine.jpg', stock: 3 },
    { id: 19, name: 'Elderton - Neil Ashmead Grand Tourer Shiraz', price: 2999, type: 'Red', varietal: 'Shiraz', abv: '14.5%', vintage: '2020', country: 'Australia', region: 'Barossa', size: '750ml', description: 'Named after the late Neil Ashmead, this Shiraz embodies power and elegance. A true representation of Barossa Shiraz.', flavors: 'Blackberry, Pepper, and Chocolate', pairings: 'Ideal with game meats and strong cheeses', image: 'assets/images/wines/Elderton - Neil Ashmead Grand Tourer - Shiraz.jpg', stock: 5 },
    { id: 20, name: 'Elderton - Command Single Vineyard - Shiraz', price: 4999, type: 'Red', varietal: 'Shiraz', abv: '14.8%', vintage: '2019', country: 'Australia', region: 'Barossa', size: '750ml', description: 'The flagship wine of Elderton, sourced from century-old vines. A powerful and complex Shiraz that showcases the best of Barossa.', flavors: 'Dark Plum, Spice, and Mocha', pairings: 'Best with rich red meat dishes', image: 'assets/images/wines/Elderton - Command Single Vineyard - Shiraz.jpg', stock: 2 },
    { id: 21, name: 'Montes Alpha - Special Cuvee Cabernet Sauvignon', price: 2499, type: 'Red', varietal: 'Cabernet Sauvignon', abv: '14%', vintage: '2020', country: 'Chile', region: 'Colchagua Valley', size: '750ml', description: 'A premium Cabernet Sauvignon from the renowned Montes winery. Shows exceptional depth and complexity with refined tannins.', flavors: 'Cassis, Cedar, and Dark Chocolate', pairings: 'Excellent with grilled meats', image: 'assets/images/wines/Montes Alpha - Special Cuvee - Cabernet Sauvignon.jpg', stock: 10 },
    { id: 22, name: 'Montes Alpha - Special Cuvee Chardonnay', price: 2299, type: 'White', varietal: 'Chardonnay', abv: '13.5%', vintage: '2021', country: 'Chile', region: 'Aconcagua Costa', size: '750ml', description: 'A sophisticated Chardonnay that balances rich fruit flavors with elegant acidity. Partially barrel-fermented for added complexity.', flavors: 'Tropical Fruit, Vanilla, and Toast', pairings: 'Perfect with rich seafood dishes', image: 'assets/images/wines/Montes Alpha - Special Cuvee - Chardonnay.jpg', stock: 12 },
    { id: 23, name: 'Montes - Outer Limits Zapallar Syrah', price: 1999, type: 'Red', varietal: 'Syrah', abv: '14%', vintage: '2021', country: 'Chile', region: 'Zapallar Valley', size: '750ml', description: 'A unique Syrah from the cool coastal Zapallar Valley. Shows exceptional freshness and complexity with pronounced pepper notes.', flavors: 'Black Pepper, Violet, and Dark Fruits', pairings: 'Excellent with spicy dishes', image: 'assets/images/wines/Montes - Outer Limits Zapallar Syrah.jpg', stock: 8 },
    { id: 24, name: 'Montes - Outer Limits Zapallar Coast Pinot Noir', price: 1999, type: 'Red', varietal: 'Pinot Noir', abv: '13.5%', vintage: '2021', country: 'Chile', region: 'Zapallar Valley', size: '750ml', description: 'An elegant Pinot Noir from the cool Zapallar coast. Shows beautiful red fruit character with subtle earthy notes.', flavors: 'Cherry, Raspberry, and Forest Floor', pairings: 'Great with duck and mushroom dishes', image: 'assets/images/wines/Montes - Outer Limits Zapallar Coast Pinot Noir.jpg', stock: 7 },
    { id: 25, name: 'Montes Alpha - Cabernet Sauvignon', price: 3499, type: 'Red', varietal: 'Cabernet Sauvignon', abv: '14.5%', vintage: '2019', country: 'Chile', region: 'Colchagua Valley', size: '1.5L', description: 'A magnum bottle of the iconic Montes Alpha Cabernet. Rich and powerful with excellent aging potential.', flavors: 'Black Currant, Cedar, and Tobacco', pairings: 'Perfect for special occasions with red meat', image: 'assets/images/wines/Montes Alpha - Cabernet Sauvignon - 1.5L Magnum.jpg', stock: 5 },
    { id: 26, name: 'Montes - Wings Carmenère', price: 2999, type: 'Red', varietal: 'Carmenère', abv: '14%', vintage: '2020', country: 'Chile', region: 'Colchagua Valley', size: '750ml', description: 'A premium expression of Chile\'s signature grape variety. Complex and full-bodied with distinctive spice notes.', flavors: 'Green Pepper, Black Fruit, and Spice', pairings: 'Excellent with lamb and grilled vegetables', image: 'assets/images/wines/Montes - Wings Carmenère.jpg', stock: 6 },
    { id: 27, name: 'Montes Alpha - M', price: 5999, type: 'Red', varietal: 'Cabernet Sauvignon, Cabernet Franc, Merlot', abv: '14.5%', vintage: '2018', country: 'Chile', region: 'Colchagua Valley', size: '750ml', description: 'The ultra-premium icon wine from Montes. A masterful blend that represents the pinnacle of Chilean winemaking.', flavors: 'Black Fruits, Coffee, and Fine Oak', pairings: 'Best with finest cuts of beef', image: 'assets/images/wines/Montes Alpha - M.jpg', stock: 3 },
    { id: 28, name: 'Montes Folly - Syrah', price: 4999, type: 'Red', varietal: 'Syrah', abv: '15%', vintage: '2019', country: 'Chile', region: 'Colchagua Valley', size: '750ml', description: 'A unique Syrah grown on the steepest slopes of Montes\' estate. Intense and complex with remarkable concentration.', flavors: 'Black Pepper, Blueberry, and Smoke', pairings: 'Perfect with game meats', image: 'assets/images/wines/Montes Folly - Syrah.jpg', stock: 4 },
    { id: 29, name: 'Montes - Purple Angel', price: 4499, type: 'Red', varietal: 'Carmenère, Petit Verdot', abv: '14.5%', vintage: '2019', country: 'Chile', region: 'Colchagua Valley', size: '750ml', description: 'An iconic wine that showcases the best of Carmenère. Rich and complex with excellent aging potential.', flavors: 'Dark Chocolate, Spice, and Black Fruits', pairings: 'Ideal with rich meat dishes', image: 'assets/images/wines/Montes - Purple Angel.jpg', stock: 5 },
    { id: 30, name: 'Montes - Taita', price: 8999, type: 'Red', varietal: 'Cabernet Sauvignon', abv: '15%', vintage: '2018', country: 'Chile', region: 'Marchigüe', size: '750ml', description: 'The ultimate expression of Montes\' winemaking philosophy. Made only in exceptional vintages from the finest Cabernet Sauvignon grapes.', flavors: 'Blackberry, Cigar Box, and Fine Oak', pairings: 'Reserved for the finest dining experiences', image: 'assets/images/wines/Montes - Taita Marchigüe Vineyard Cabernet Sauvignon.jpg', stock: 2 }
  ];

  private productsSubject = new BehaviorSubject<Product[]>([]);

  constructor() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      this.products = JSON.parse(storedProducts);
    } else {
      // Initialize with default stock if nothing is in local storage
      localStorage.setItem('products', JSON.stringify(this.products));
    }
    this.productsSubject.next([...this.products]);
  }

  getProducts(): Promise<Product[]> {
    return Promise.resolve([...this.products]);
  }

  getProductById(id: number): Promise<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return Promise.resolve(product ? { ...product } : undefined);
  }

  async updateProductStock(productId: number, newStock: number): Promise<boolean> {
    const productIndex = this.products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return false;
    }

    this.products[productIndex].stock = Number(newStock);
    this.saveProducts();
    return true;
  }

  private saveProducts() {
    localStorage.setItem('products', JSON.stringify(this.products));
    this.productsSubject.next([...this.products]);
  }
}