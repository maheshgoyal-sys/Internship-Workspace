import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Otp } from './pages/otp/otp';

import { HomeComponent } from './pages/home/home.component';
import { Dashboard } from './pages/dashboard/dashboard';
import { Profile } from './pages/profile/profile';
import { Contact } from './pages/contact/contact';
import { TicketList } from './pages/ticket-list/ticket-list';
import { TicketDetail } from './pages/ticket-detail/ticket-detail';
import { CreateTicket } from './pages/create-ticket/create-ticket';
import { EditTicket } from './pages/edit-ticket/edit-ticket';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'otp',
    component: Otp
  },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard]
  },

  {
    path: 'contact',
    component: Contact,
    canActivate: [authGuard]
  },

  {
    path: 'tickets',
    component: TicketList,
    canActivate: [authGuard]
  },

  {
    path: 'tickets/create',
    component: CreateTicket,
    canActivate: [authGuard]
  },

  {
    path: 'ticket/:id',
    component: TicketDetail,
    canActivate: [authGuard]
  },

  {
    path: 'tickets/edit/:id',
    component: EditTicket,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];