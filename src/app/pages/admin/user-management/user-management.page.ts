import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonChip,
  IonBadge,
  IonModal,
  IonInput,
  IonButtons,
  IonItemDivider,
  IonAvatar,
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  searchOutline, 
  filterOutline, 
  personOutline, 
  mailOutline, 
  keyOutline,
  calendarOutline,
  timeOutline,
  callOutline,
  locationOutline,
  createOutline,
  trashOutline,
  arrowBackOutline
} from 'ionicons/icons';
import { AuthService } from '../../../services/auth.service';

import { User } from '../../../services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonChip,
    IonModal,
    IonButtons,
    IonAvatar
  ]
})
export class UserManagementPage implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  selectedRole: string = '';
  selectedUser: User | null = null;
  isModalOpen: boolean = false;

  roles: ('admin' | 'customer')[] = ['admin', 'customer'];

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private location: Location
  ) {
    addIcons({arrowBackOutline,personOutline,mailOutline,calendarOutline,createOutline,trashOutline,searchOutline,filterOutline,keyOutline,timeOutline,callOutline,locationOutline});
  }

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    const loading = await this.loadingController.create({
      message: 'Loading users...',
    });
    await loading.present();

    try {
      // Replace with your actual service call
      this.users = await this.authService.getAllUsers();
      this.applyFilters();
    } catch (error) {
      console.error('Error loading users:', error);
      this.showToast('Error loading users', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = this.searchTerm 
        ? (user.firstName + ' ' + user.lastName).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const matchesRole = this.selectedRole 
        ? user.role === this.selectedRole
        : true;

      return matchesSearch && matchesRole;
    });
  }

  async openUserDetails(user: User) {
    this.selectedUser = { ...user };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  async updateUserRole(user: User) {
    const alert = await this.alertController.create({
      header: 'Change User Role',
      inputs: [
        {
          name: 'role',
          type: 'radio',
          label: 'Admin',
          value: 'admin',
          checked: user.role === 'admin'
        },
        {
          name: 'role',
          type: 'radio',
          label: 'Customer',
          value: 'customer',
          checked: user.role === 'customer'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Update',
          handler: async (data) => {
            if (!data) {
              return false;
            }

            try {
              // Check if this is the last admin
              if (user.role === 'admin' && data === 'customer') {
                const allUsers = await this.authService.getAllUsers();
                const adminCount = allUsers.filter(u => u.role === 'admin').length;
                if (adminCount <= 1) {
                  this.showToast('Cannot remove the last admin', 'danger');
                  return false;
                }
              }

              const success = await this.authService.updateUserRole(user.id, data);
              if (success) {
                user.role = data;
                // If the current user is being updated, refresh their session
                const currentUser = await this.authService.getCurrentUser();
                if (currentUser && currentUser.id === user.id) {
                  await this.authService.refreshUserSession(user);
                }
                this.showToast('User role updated successfully', 'success');
                this.loadUsers(); // Refresh the user list
                return true;
              } else {
                this.showToast('Error updating user role', 'danger');
                return false;
              }
            } catch (error) {
              this.showToast('Error updating user role', 'danger');
              console.error('Error updating role:', error);
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteUser(userId: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            try {
              await this.authService.deleteUser(userId);
              this.users = this.users.filter(u => u.id !== userId);
              this.applyFilters();
              this.showToast('User deleted successfully', 'success');
            } catch (error) {
              this.showToast('Error deleting user', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }

  goBack() {
    this.location.back();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
}