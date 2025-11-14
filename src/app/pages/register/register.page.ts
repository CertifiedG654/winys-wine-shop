import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  ToastController,
  IonNote,
  IonBackButton,
  IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personAddOutline, personCircleOutline, mailOutline, lockClosedOutline, callOutline, locationOutline, trashOutline, imageOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const errors: ValidationErrors = {};

  if (value.length < 8) {
    errors['minLength'] = true;
  }
  if (!/[A-Z]/.test(value)) {
    errors['uppercase'] = true;
  }
  if (!/[a-z]/.test(value)) {
    errors['lowercase'] = true;
  }
  if (!/[0-9]/.test(value)) {
    errors['number'] = true;
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    errors['special'] = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
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
    IonNote,
    IonBackButton,
    IonButtons
  ]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  profileImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({personAddOutline,personCircleOutline,imageOutline,trashOutline,mailOutline,lockClosedOutline,callOutline,locationOutline});

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator]],
      confirmPassword: ['', Validators.required],
      profileImage: [null],
      address: ['', Validators.required],
      contactNumber: ['', Validators.required],
    }, { validators: passwordsMatchValidator });
  }

  ngOnInit() {}

  async register() {
    if (this.registerForm.invalid) {
      this.showToast('Please fill out all fields correctly.', 'danger');
      return;
    }

    const formData = this.registerForm.value;
    formData.profileImage = this.profileImage;

    const result = this.authService.register(formData);

    if (result.success) {
      this.showToast('Registration successful! Please log in.', 'success');
      this.router.navigate(['/login']);
    } else {
      this.showToast(result.error || 'Registration failed.', 'danger');
    }
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
    });
    await toast.present();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  removeImage() {
    this.profileImage = null;
  }
}