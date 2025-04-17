import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const MUI = [MatFormFieldModule, MatInputModule];

@Component({
  selector: 'app-payment',
  imports: [CommonModule, ...MUI],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent {}
