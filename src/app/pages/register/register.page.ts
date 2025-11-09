import { Component, ViewChild, ElementRef } from '@angular/core';
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
  IonIcon,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, cameraOutline, trashOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
    IonIcon
  ]
})
export class RegisterPage {
  @ViewChild('fileInput') fileInput!: ElementRef;

  userData = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    profileImage: ''
  };

  profileImagePreview: string | null = null;
  selectedFile: File | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ personOutline, cameraOutline, trashOutline });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImagePreview = e.target.result;
        this.userData.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfileImage() {
    this.profileImagePreview = null;
    this.userData.profileImage = '';
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
  }

  async register() {
    // Validation
    if (this.userData.password !== this.userData.confirmPassword) {
      this.showToast('Passwords do not match!', 'danger');
      return;
    }

    if (!this.userData.firstName || !this.userData.lastName || !this.userData.email || !this.userData.password) {
      this.showToast('Please fill all required fields!', 'danger');
      return;
    }

    this.isLoading = true;
    
    const loading = await this.loadingCtrl.create({
      message: 'Creating account...'
    });
    await loading.present();

    try {
      const result = this.authService.register(this.userData);
      
      if (result.success) {
        await loading.dismiss();
        this.showToast('Account created successfully! Please login.', 'success');
        this.router.navigate(['/login']);
      } else {
        await loading.dismiss();
        this.showToast(result.error || 'Registration failed!', 'danger');
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