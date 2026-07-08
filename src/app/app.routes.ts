import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './shared/admin-layout/admin-layout';

import { DashboardComponent } from './pages/dashboard/dashboard';
import { ProductosComponent } from './pages/productos/productos';
import { ServiciosComponent } from './pages/servicios/servicios';
import { CotizacionesComponent } from './pages/cotizaciones/cotizaciones';
import { ClientesComponent } from './pages/clientes/clientes';
import { VentasComponent } from './pages/ventas/ventas';

import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public/layout/public-layout').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./public/pages/inicio-publico/inicio-publico').then(m => m.InicioPublicoComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        component: DashboardComponent,
        canActivate: [permissionGuard],
        data: {
          permisos: ['INICIO_VER']
        }
      },
      {
        path: 'productos',
        component: ProductosComponent,
        canActivate: [permissionGuard],
        data: {
          permisos: ['PRODUCTOS_VER']
        }
      },
      {
        path: 'servicios',
        component: ServiciosComponent,
        canActivate: [permissionGuard],
        data: {
          permisos: ['SERVICIOS_VER']
        }
      },
      {
        path: 'cotizaciones',
        component: CotizacionesComponent,
        canActivate: [permissionGuard],
        data: {
          permisos: ['COTIZACIONES_VER']
        }
      },
      {
        path: 'clientes',
        component: ClientesComponent,
        canActivate: [permissionGuard],
        data: {
          permisos: ['CLIENTES_VER']
        }
      },
      {
        path: 'ventas',
        component: VentasComponent,
        canActivate: [permissionGuard],
        data: {
          permisos: ['VENTAS_VER']
        }
      },
      {
        path: 'proveedores',
        canActivate: [permissionGuard],
        data: {
          permisos: ['PROVEEDORES_VER']
        },
        loadComponent: () =>
          import('./pages/proveedores/proveedores').then(m => m.ProveedoresComponent)
      },
      {
        path: 'compras',
        canActivate: [permissionGuard],
        data: {
          permisos: ['COMPRAS_VER']
        },
        loadComponent: () =>
          import('./pages/compras/compras').then(m => m.ComprasComponent)
      },
      {
        path: 'inventario',
        canActivate: [permissionGuard],
        data: {
          permisos: ['INVENTARIO_VER']
        },
        loadComponent: () =>
          import('./pages/inventario/inventario').then(m => m.InventarioComponent)
      },
      {
        path: 'caja',
        canActivate: [permissionGuard],
        data: {
          permisos: ['CAJA_VER']
        },
        loadComponent: () =>
          import('./pages/caja/caja').then(m => m.CajaComponent)
      },
      {
        path: 'usuarios-roles',
        canActivate: [permissionGuard],
        data: {
          permisos: ['USUARIOS_VER', 'ROLES_VER']
        },
        loadComponent: () =>
          import('./pages/usuarios-roles/usuarios-roles').then(m => m.UsuariosRolesComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];