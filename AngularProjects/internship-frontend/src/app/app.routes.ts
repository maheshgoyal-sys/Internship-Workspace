import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Profile } from './pages/profile/profile';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: 'dashboard', component: Dashboard },
  { path: 'profile', component: Profile },
  { path: 'contact', component: Contact },

  { path: '**', redirectTo: 'dashboard' }
];