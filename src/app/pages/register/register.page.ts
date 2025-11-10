import { Component, ViewChild, ElementRef, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { isPlatform } from '@ionic/angular/standalone';
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
  ToastController,
  AlertController,
  IonText
} from '@ionic/angular/standalone';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { addIcons } from 'ionicons';
import { personOutline, cameraOutline, trashOutline, imageOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styles: [`
    .profile-image-container {
      position: relative;
      touch-action: manipulation;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 16px;
      width: 100%;
      max-width: 300px;
      margin: 0 auto;
    }

    .profile-image-preview {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      background-color: var(--ion-color-light);
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      border: 2px solid var(--ion-color-medium);
    }

    .profile-image-preview.has-image {
      border-color: var(--ion-color-primary);
    }

    .profile-image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-image-placeholder {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    .profile-image-placeholder ion-icon {
      font-size: 64px;
      color: var(--ion-color-medium);
    }

    .upload-button {
      margin-top: 16px;
    }

    .upload-buttons {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 100%;
      position: relative;
      z-index: 1;
    }

    .upload-hint {
      font-size: 0.8em;
      text-align: center;
    }

    @media (max-width: 768px) {
      .profile-image-preview {
        width: 120px;
        height: 120px;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }

      .profile-image-placeholder ion-icon {
        font-size: 48px;
      }

      .upload-buttons {
        padding: 16px;
      }

      .upload-button {
        width: 100%;
        max-width: 200px;
        --padding-top: 12px;
        --padding-bottom: 12px;
      }
    }

    /* iOS-specific styles */
    @supports (-webkit-touch-callout: none) {
      .profile-image-container {
        cursor: pointer;
      }

      input[type="file"] {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        z-index: 2;
      }
    }
  `],
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
    IonIcon,
    IonText
  ]
})
export class RegisterPage {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;
  
  private readonly isIOS: boolean = isPlatform('ios');
  private mediaStream: MediaStream | null = null;
  private isCameraOpen = false;

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

  profileImagePreview: SafeUrl | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  showCamera = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private sanitizer: DomSanitizer,
    private ngZone: NgZone
  ) {
    addIcons({ personOutline, cameraOutline, imageOutline, trashOutline });
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  async stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.showCamera = false;
    this.isCameraOpen = false;
  }

  async openImageOptions() {
    const alert = await this.alertController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            if (this.isIOS) {
              this.startCamera();
            } else {
              this.fileInput.nativeElement.setAttribute('capture', 'environment');
              this.fileInput.nativeElement.click();
            }
          }
        },
        {
          text: 'Gallery',
          handler: () => {
            this.fileInput.nativeElement.removeAttribute('capture');
            this.fileInput.nativeElement.click();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      this.mediaStream = stream;
      this.showCamera = true;
      this.isCameraOpen = true;

      // Wait for DOM update
      setTimeout(() => {
        if (this.videoElement?.nativeElement) {
          this.videoElement.nativeElement.srcObject = stream;
          this.videoElement.nativeElement.play();
        }
      });
    } catch (err) {
      console.error('Error accessing camera:', err);
      await this.showToast('Could not access camera. Please check permissions.', 'danger');
      // Fallback to regular file input
      this.fileInput.nativeElement.click();
    }
  }

  async takePicture() {
    if (!this.isCameraOpen || !this.videoElement?.nativeElement || !this.canvasElement?.nativeElement) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    
    // Set canvas size to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0);
    
    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        }, 'image/jpeg', 0.8);
      });

      // Create file from blob
      const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
      
      // Process the image
      await this.processImage(file);
      
      // Stop camera after capturing
      this.stopCamera();
      
    } catch (error) {
      console.error('Error capturing image:', error);
      await this.showToast('Error capturing image', 'danger');
    }
  }

  async onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Validate file
      if (!this.validateFile(file)) {
        return;
      }

      // Process the image
      await this.processImage(file);

      // Reset the input
      this.fileInput.nativeElement.value = '';

    } catch (error) {
      console.error('Error processing image:', error);
      await this.showToast('Error processing image', 'danger');
    }
  }

  private validateFile(file: File): boolean {
    // Check file type
    if (!file.type.startsWith('image/')) {
      this.showToast('Please select an image file', 'warning');
      return false;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showToast('Image size should be less than 5MB', 'warning');
      return false;
    }

    return true;
  }

  private async processImage(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e: any) => {
        try {
          const img = new Image();
          img.onload = async () => {
            try {
              const processedImage = await this.optimizeImage(img);
              this.ngZone.run(() => {
                this.profileImagePreview = this.sanitizer.bypassSecurityTrustUrl(processedImage);
                this.userData.profileImage = processedImage;
                this.selectedFile = file;
              });
              resolve();
            } catch (error) {
              reject(error);
            }
          };
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = e.target.result;
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        this.showToast('Error reading file', 'danger');
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  private async optimizeImage(img: HTMLImageElement): Promise<string> {
    const maxDimension = 1200;
    const maxFileSize = 1024 * 1024; // 1MB target size
    let quality = 0.8;
    
    // Calculate dimensions
    let { width, height } = this.calculateDimensions(img.width, img.height, maxDimension);

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    // Draw image with proper orientation
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Handle image orientation
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(1, 1);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();

    // Compress with quality adjustment if needed
    let result = canvas.toDataURL('image/jpeg', quality);
    while (result.length > maxFileSize && quality > 0.3) {
      quality -= 0.1;
      result = canvas.toDataURL('image/jpeg', quality);
    }

    return result;
  }

  private calculateDimensions(width: number, height: number, maxDimension: number): { width: number, height: number } {
    if (width > height) {
      if (width > maxDimension) {
        height = Math.round(height * maxDimension / width);
        width = maxDimension;
      }
    } else {
      if (height > maxDimension) {
        width = Math.round(width * maxDimension / height);
        height = maxDimension;
      }
    }
    return { width, height };
  }

  removeProfileImage() {
    this.stopCamera();
    this.profileImagePreview = null;
    this.userData.profileImage = '';
    this.selectedFile = null;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
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