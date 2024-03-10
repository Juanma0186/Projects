import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CiudadanoComponent } from './components/ciudadano/ciudadano.component';
import { PromotorComponent } from './components/promotor/promotor.component';
import { BancoComponent } from './components/banco/banco.component';
import { HomeComponent } from './components/home/home.component';
import { AdminCiudadanosComponent } from './components/admin-ciudadanos/admin-ciudadanos.component';
import { AdminBancosComponent } from './components/admin-bancos/admin-bancos.component';
import { AdminPromotoresComponent } from './components/admin-promotores/admin-promotores.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AuthGuard } from './services/auth.guard';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { ReclamacionesComponent } from './components/reclamaciones/reclamaciones.component';
import { FraudeComponent } from './components/fraude/fraude.component';

export const routes: Routes = [

  { path: 'reclamacion', component: ReclamacionesComponent },
  { path: 'fraude', component: FraudeComponent },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'ciudadano/:nombre',
    component: CiudadanoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ciudadano', 'admin'] },
  },
  {
    path: 'promotor/:nombre',
    component: PromotorComponent,
    canActivate: [AuthGuard],
    data: { roles: ['promotor', 'admin'] },
  },
  {
    path: 'entidad/:banco',
    component: BancoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['banco', 'admin'] },
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    children: [
      { path: 'inicio', component: AdminHomeComponent },
      { path: 'ciudadanos', component: AdminCiudadanosComponent },
      { path: 'promotores', component: AdminPromotoresComponent },
      { path: 'entidades', component: AdminBancosComponent },
    ],
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
