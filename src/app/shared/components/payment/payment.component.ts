import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriesComponent } from './categories/categories.component';

const COMPONENTS = [CategoriesComponent];

const MUI = [MatFormFieldModule, MatInputModule];

@Component({
  selector: 'app-payment',
  imports: [CommonModule, ...MUI, ...COMPONENTS],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent {}
