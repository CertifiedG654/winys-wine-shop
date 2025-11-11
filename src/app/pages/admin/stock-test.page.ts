import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { Location } from '@angular/common';

@Component({
  selector: 'app-stock-test',
  templateUrl: './stock-test.page.html',
  styleUrls: [],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonButtons
  ]
})
export class StockTestPage implements OnInit {

  constructor(private location: Location) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

}
