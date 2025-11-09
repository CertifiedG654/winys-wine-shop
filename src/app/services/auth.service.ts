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
      role: 'admin'
    }
  ];

  constructor() {
    this.autoLogin();
  }

  register(userData: Omit<User, 'id' | 'role'>): { success: boolean; error?: string } {
    // Check if email already exists
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      return { success: false, error: 'Email already exists' };
    }

    // Create new user
    const newUser: User = {
      ...userData,
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