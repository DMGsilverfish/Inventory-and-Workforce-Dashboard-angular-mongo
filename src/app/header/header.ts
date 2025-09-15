import { Component, Input } from '@angular/core';
import { LogoutComponent } from "../logout/logout.component";

@Component({
  selector: 'app-header',
  imports: [LogoutComponent],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  @Input() headerText: string = '';
}
