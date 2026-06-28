import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  hasUnreadNotifications = true;

  openNotifications(): void {
    // TODO: wire up notification panel / route
    console.log('Notifications clicked');
  }
}