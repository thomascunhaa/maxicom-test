import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',

})
export class InputComponent {
  @Input() placeholderInput!: string;
  @Input() name!: string;
  @Output() valueInput!: string;


}
