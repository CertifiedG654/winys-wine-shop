import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.page').then(m => m.ProductsPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'company-history',
    loadComponent: () => import('./pages/company-history/company-history.page').then(m => m.CompanyHistoryPage)
  },
  {
    path: 'about-app',
    loadComponent: () => import('./pages/about-app/about-app.page').then(m => m.AboutAppPage)
  },
  {
    path: 'developers',
    loadComponent: () => import('./pages/developers/developers.page').then(m => m.DevelopersPage)
  },
  {
    path: 'contact-us',
    loadComponent: () => import('./pages/contact-us/contact-us.page').then(m => m.ContactUsPage)
  },
  {
    path: 'admin-orders',
    loadComponent: () => import('./pages/admin-orders/admin-orders.page').then(m => m.AdminOrdersPage),
    canActivate: [AdminGuard]
  },
  {
    path: 'sales-analytics',
    loadComponent: () => import('./pages/sales-analytics/sales-analytics.page').then(m => m.SalesAnalyticsPage),
    canActivate: [AdminGuard]
  },
  {
    path: 'order-tracking/:id',
    loadComponent: () => import('./pages/order-tracking/order-tracking.page').then(m => m.OrderTrackingPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'customer',
    loadComponent: () => import('./components/side-menu/side-menu.component').then(m => m.SideMenuComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products.page').then(m => m.ProductsPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart.page').then(m => m.CartPage)
      },
      {
        path: 'company-history',
        loadComponent: () => import('./pages/company-history/company-history.page').then(m => m.CompanyHistoryPage)
      },
      {
        path: 'about-app',
        loadComponent: () => import('./pages/about-app/about-app.page').then(m => m.AboutAppPage)
      },
      {
        path: 'developers',
        loadComponent: () => import('./pages/developers/developers.page').then(m => m.DevelopersPage)
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders.page').then(m => m.OrdersPage)
      },
      {
        path: 'contact-us',
        loadComponent: () => import('./pages/contact-us/contact-us.page').then(m => m.ContactUsPage)
      },
      {
        path: 'order-tracking/:id',
        loadComponent: () => import('./pages/order-tracking/order-tracking.page').then(m => m.OrderTrackingPage)
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products.page').then(m => m.ProductsPage)
      },
      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin.page').then(m => m.AdminPage),
        canActivate: [AdminGuard]
      },
      {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart.page').then(m => m.CartPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: '',
        redirectTo: '/tabs/products',
        pathMatch: 'full'
      }
    ]
  }
];