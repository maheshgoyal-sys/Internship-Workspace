import { Routes } from '@angular/router';
import { CreateTicket } from './pages/create-ticket/create-ticket';
import { Dashboard } from './pages/dashboard/dashboard';
import { Profile } from './pages/profile/profile';
import { Contact } from './pages/contact/contact';
import { HomeComponent } from './pages/home/home.component';
import { TicketList } from './pages/ticket-list/ticket-list';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: Dashboard },
  { path: 'profile', component: Profile },
  { path: 'contact', component: Contact },
  
  { path: 'tickets', component: TicketList },
  { path: 'tickets/create', component: CreateTicket },

  { path: '**', redirectTo: 'dashboard' }
];