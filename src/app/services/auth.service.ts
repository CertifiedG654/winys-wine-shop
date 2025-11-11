import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  contactNumber: string;
  profileImage?: string;
  role: 'admin' | 'customer';
  pendingUpdates?: {
    address?: string;
    contactNumber?: string;
  };
  hasPendingUpdates?: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUser.asObservable();

  private users: User[] = [
    {
      id: 1,
      firstName: 'Winys',
      lastName: 'Admin',
      email: 'admin@winys.com',
      password: 'admin123',
      address: 'Admin Address',
      contactNumber: '+1234567890',
      profileImage: '',
      role: 'admin',
      createdAt: new Date('2023-01-01'),
      lastLogin: new Date()
    }
  ];

  constructor() {
    this.autoLogin();
  }

  // User Management Methods
  getAllUsers(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  getUserById(id: number): Promise<User | undefined> {
    const user = this.users.find(u => u.id === id);
    return Promise.resolve(user);
  }

  async updateUserRole(userId: number, newRole: 'admin' | 'customer'): Promise<boolean> {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    // Check if this would remove the last admin
    if (this.users[userIndex].role === 'admin' && newRole === 'customer') {
      const adminCount = this.users.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        return false;
      }
    }

    this.users[userIndex].role = newRole;
    localStorage.setItem('users', JSON.stringify(this.users));

    // If this is the current user, update their session
    if (this.currentUser.value?.id === userId) {
      const updatedUser = { ...this.users[userIndex] };
      await this.refreshUserSession(updatedUser);
    }

    return true;
  }

  async deleteUser(userId: number): Promise<boolean> {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }

  async updateUserLastLogin(userId: number): Promise<void> {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex].lastLogin = new Date();
    }
  }

  async requestProfileUpdate(userId: number, updates: { address?: string; contactNumber?: string }): Promise<boolean> {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    this.users[userIndex].pendingUpdates = updates;
    this.users[userIndex].hasPendingUpdates = true;
    localStorage.setItem('users', JSON.stringify(this.users));

    // If this is the current user, update their session
    if (this.currentUser.value?.id === userId) {
      const updatedUser = { ...this.users[userIndex] };
      await this.refreshUserSession(updatedUser);
    }

    return true;
  }

  async approveUserUpdate(userId: number): Promise<boolean> {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1 || !this.users[userIndex].pendingUpdates) return false;

    const updates = this.users[userIndex].pendingUpdates!;
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    delete this.users[userIndex].pendingUpdates;
    this.users[userIndex].hasPendingUpdates = false;
    localStorage.setItem('users', JSON.stringify(this.users));
    return true;
  }

  async rejectUserUpdate(userId: number): Promise<boolean> {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    delete this.users[userIndex].pendingUpdates;
    this.users[userIndex].hasPendingUpdates = false;
    localStorage.setItem('users', JSON.stringify(this.users));
    return true;
  }

  register(userData: Omit<User, 'id' | 'role' | 'createdAt' | 'lastLogin'>): { success: boolean; error?: string } {
    // Check if email already exists
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      return { success: false, error: 'Email already exists' };
    }

    // Create new user
    const newUser: User = {
      ...userData,
      createdAt: new Date(),
      id: this.users.length + 1,
      role: 'customer'
    };

    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
    
    return { success: true };
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.currentUser.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  }

  async logout(): Promise<void> {
    this.currentUser.next(null);
    localStorage.removeItem('currentUser');
  }

  async autoLogin(): Promise<void> {
    // Load users from localStorage
    const usersData = localStorage.getItem('users');
    if (usersData) {
      this.users = JSON.parse(usersData);
    }

    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUser.next(user);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser.value;
  }

  async refreshUserSession(user: User): Promise<void> {
    this.currentUser.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  isAdmin(): boolean {
    return this.currentUser.value?.role === 'admin';
  }

  isCustomer(): boolean {
    return this.currentUser.value?.role === 'customer';
  }

  isLoggedIn(): boolean {
    return this.currentUser.value !== null;
  }

  updateUserProfile(updatedUser: User): void {
    const index = this.users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(this.users));
      
      if (this.currentUser.value?.id === updatedUser.id) {
        this.currentUser.next(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }
  }
}