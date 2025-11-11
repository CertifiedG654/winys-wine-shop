import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
  IonButtons,
  IonMenuButton,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, createOutline, saveOutline, informationCircleOutline } from 'ionicons/icons';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonText,
    IonSpinner,
    IonButtons,
    IonMenuButton
  ]
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;
  isEditing = false;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastController: ToastController
  ) {
    addIcons({ personCircleOutline, createOutline, saveOutline, informationCircleOutline });

    this.profileForm = this.fb.group({
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      address: ['', Validators.required],
      contactNumber: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.profileForm.patchValue(this.user);
      if (this.user.hasPendingUpdates) {
        this.profileForm.get('address')?.disable();
        this.profileForm.get('contactNumber')?.disable();
      }
    }
    this.isLoading = false;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  async saveChanges() {
    if (this.profileForm.invalid || !this.user) {
      return;
    }

    const updates = {
      address: this.profileForm.value.address,
      contactNumber: this.profileForm.value.contactNumber
    };

    const success = await this.authService.requestProfileUpdate(this.user.id, updates);
    const toast = await this.toastController.create({
      message: success ? 'Update request sent for admin approval.' : 'Failed to send update request.',
      duration: 3000,
      color: success ? 'success' : 'danger'
    });
    await toast.present();

    if (success) {
      this.isEditing = false;
      // Reload user data to reflect pending status
      this.ngOnInit();
    }
  }
}