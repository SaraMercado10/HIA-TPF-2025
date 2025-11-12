import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AlquilerFormComponent } from './components/alquiler-form/alquiler-form.component';
import { LocalFormComponent } from './components/local-form/local-form.component';
import { TablaLocalComponent } from './components/tabla-local/tabla-local.component';
import { TablaAlquilerComponent } from './components/tabla-alquiler/tabla-alquiler.component';
import { LocalComponent } from './components/local/local.component';
import { LoginComponent } from './components/login/login.component';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { AuthGuard } from './guards/auth.guard';
import { PromocionFormComponent } from './components/promocion-form/promocion-form.component';
import { DetalleAlquilerComponent } from './components/detalle-alquiler/detalle-alquiler.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuarioFormComponent } from './components/usuario-form/usuario-form.component';
import { PromocionTablaComponent } from './components/promocion-tabla/promocion-tabla.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    //usuario
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'usuario-form', component: UsuarioFormComponent, canActivate: [AuthGuard]},
    { path: 'usuario-form/:id', component: UsuarioFormComponent },
    
    //local
    { path: 'local-form/:id', component: LocalFormComponent },
    { path: 'local-tabla', component: TablaLocalComponent },
    { path: 'local/:id', component: LocalComponent },
    
    //alquiler
    { path: 'alquiler-form/:id', component: AlquilerFormComponent,canActivate: [AuthGuard] },
    { path: 'alquiler-tabla', component: TablaAlquilerComponent,canActivate: [AuthGuard] },
    { path : 'alquiler-detalle/:id', component: DetalleAlquilerComponent }, 
    
    //login
    { path:'login', component: LoginComponent},
    
    //novedad
    { path:'novedades', component: NovedadesComponent,canActivate: [AuthGuard]},
    { path: 'estadisticas', component: EstadisticasComponent,canActivate: [AuthGuard]},
    { path: 'promocion', component: PromocionFormComponent, canActivate: [AuthGuard]},
    { path: 'promocion-tabla', component: PromocionTablaComponent, canActivate: [AuthGuard]}
];