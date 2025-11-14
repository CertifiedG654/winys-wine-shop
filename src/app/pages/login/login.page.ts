import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBackButton,
  IonButtons,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBackButton,
    IonButtons
  ]
})
export class LoginPage {
  credentials = {
    email: '',
    password: ''
  };

  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async login() {
    this.isLoading = true;
    
    const loading = await this.loadingCtrl.create({
      message: 'Signing in...'
    });
    await loading.present();

    try {
      const result = await this.authService.login(this.credentials.email, this.credentials.password);
      
      if (result.success) {
        await loading.dismiss();
        
        if (result.user?.role === 'admin') {
          this.router.navigate(['/tabs/admin']);
        } else {
          this.router.navigate(['/customer/products']); // Changed to customer side menu
        }
        
        this.showToast('Login successful!', 'success');
      } else {
        await loading.dismiss();
        this.showToast(result.error || 'Login failed!', 'danger');
      }
    } catch (error) {
      await loading.dismiss();
      this.showToast('An error occurred!', 'danger');
    } finally {
      this.isLoading = false;
    }
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