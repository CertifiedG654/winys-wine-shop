import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'wine-list',
    loadChildren: () => import('./pages/wine-list/wine-list.module').then(m => m.WineListPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutPageModule)
  },
  {
    path: 'order-tracking/:id',
    loadChildren: () => import('./pages/order-tracking/order-tracking.module').then(m => m.OrderTrackingPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/login/admin-login.module').then(m => m.AdminLoginPageModule)
  },
  {
    path: 'admin/dashboard',
    loadChildren: () => import('./pages/admin/dashboard/admin-dashboard.module').then(m => m.AdminDashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/orders',
    loadChildren: () => import('./pages/admin/orders/admin-orders.module').then(m => m.AdminOrdersPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/sales-analytics',
    loadChildren: () => import('./pages/admin/sales-analytics/admin-sales-analytics.module').then(m => m.AdminSalesAnalyticsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/order-details/:id',
    loadChildren: () => import('./pages/admin/order-details/admin-order-details.module').then(m => m.AdminOrderDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/user-management',
    loadComponent: () => import('./pages/admin/user-management/user-management.page').then(m => m.UserManagementPage),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }