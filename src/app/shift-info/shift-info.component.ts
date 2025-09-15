import { Component } from '@angular/core';

@Component({
  selector: 'app-shift-info',
  imports: [],
  templateUrl: './shift-info.component.html',
  styleUrl: './shift-info.component.css'
})
export class ShiftInfo {
  showMessage = false;

  toggleMessage() {
    this.showMessage = !this.showMessage;
  }

}
