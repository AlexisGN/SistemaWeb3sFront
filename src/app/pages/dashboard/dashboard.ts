import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ServicioService } from '../../core/services/servicio';
import { CotizacionService } from '../../core/services/cotizacion';
import { ProductoService } from '../../core/services/producto';
import { ProveedorService } from '../../core/services/proveedor';
import { InventarioService } from '../../core/services/inventario';
import { ClienteService } from '../../core/services/cliente';
import { CompraService } from '../../core/services/compra';

import { MovimientoStockListado } from '../../core/models/inventario.model';
import { CompraListado } from '../../core/models/compra.model';

interface DashboardCard {
  label: string;
  value: string;
  description: string;
  tag: string;
  status: 'ready' | 'pending' | 'warning' | 'money';
}

interface QuickAction {
  label: string;
  description: string;
  route?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  cargando = false;

  movimientosRecientes: MovimientoStockListado[] = [];

  cards: DashboardCard[] = [
    {
      label: 'Productos activos',
      value: '0',
      description: 'Catálogo industrial disponible',
      tag: 'PR',
      status: 'ready'
    },
    {
      label: 'Servicios activos',
      value: '0',
      description: 'Servicios publicados para clientes',
      tag: 'SV',
      status: 'ready'
    },
    {
      label: 'Clientes activos',
      value: '0',
      description: 'Clientes disponibles para ventas',
      tag: 'CL',
      status: 'ready'
    },
    {
      label: 'Proveedores activos',
      value: '0',
      description: 'Proveedores disponibles para compras',
      tag: 'PV',
      status: 'ready'
    },
    {
      label: 'Cotizaciones pendientes',
      value: '0',
      description: 'Solicitudes por atender',
      tag: 'CT',
      status: 'warning'
    },
    {
      label: 'Ventas del día',
      value: 'S/ 0.00',
      description: 'Ingresos comerciales del día',
      tag: 'VT',
      status: 'money'
    },
    {
      label: 'Productos con stock bajo',
      value: '0',
      description: 'Productos por debajo del mínimo',
      tag: 'ST',
      status: 'warning'
    },
    {
      label: 'Saldo de caja',
      value: 'S/ 0.00',
      description: 'Saldo operativo disponible',
      tag: 'CJ',
      status: 'money'
    },
    {
      label: 'Compras pendientes de pago',
      value: '0',
      description: 'Compras con saldo pendiente',
      tag: 'CP',
      status: 'warning'
    }
  ];

  quickActions: QuickAction[] = [
    {
      label: 'Nuevo producto',
      description: 'Registrar producto industrial',
      route: '/admin/productos'
    },
    {
      label: 'Nuevo servicio',
      description: 'Registrar servicio de 3S',
      route: '/admin/servicios'
    },
    {
      label: 'Registrar cliente',
      description: 'Agregar cliente natural o empresa',
      route: '/admin/clientes'
    },
    {
      label: 'Registrar proveedor',
      description: 'Consultar RUC por SUNAT y registrar proveedor',
      route: '/admin/proveedores'
    },
    {
      label: 'Ver stock bajo',
      description: 'Revisar productos con stock bajo o sin stock',
      route: '/admin/inventario'
    },
    {
      label: 'Registrar venta',
      description: 'Crear venta directa o desde cotización',
      route: '/admin/ventas'
    },
    {
      label: 'Registrar compra',
      description: 'Ingresar compra a proveedor',
      route: '/admin/compras'
    }
  ];

  constructor(
    private productoService: ProductoService,
    private servicioService: ServicioService,
    private cotizacionService: CotizacionService,
    private proveedorService: ProveedorService,
    private inventarioService: InventarioService,
    private clienteService: ClienteService,
    private compraService: CompraService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarResumenProductos();
    this.cargarResumenServicios();
    this.cargarResumenClientes();
    this.cargarResumenCotizaciones();
    this.cargarResumenProveedores();
    this.cargarResumenInventario();
    this.cargarResumenComprasPendientesPago();
    this.cargarMovimientosRecientes();
  }

  cargarResumenProductos(): void {
    this.cargando = true;

    this.productoService.contarActivos().subscribe({
      next: (data) => {
        this.actualizarCard('Productos activos', String(data.total));
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando resumen de productos:', err);
        this.actualizarCard('Productos activos', '0');
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarResumenServicios(): void {
    this.servicioService.contarActivos().subscribe({
      next: (data) => {
        this.actualizarCard('Servicios activos', String(data.total));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando resumen de servicios:', err);
        this.actualizarCard('Servicios activos', '0');
        this.cdr.detectChanges();
      }
    });
  }

  cargarResumenClientes(): void {
    this.clienteService.contarActivos().subscribe({
      next: (data) => {
        this.actualizarCard('Clientes activos', String(data.total));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando resumen de clientes:', err);
        this.actualizarCard('Clientes activos', '0');
        this.cdr.detectChanges();
      }
    });
  }

  cargarResumenCotizaciones(): void {
    this.cotizacionService.contarPendientes().subscribe({
      next: (data) => {
        this.actualizarCard('Cotizaciones pendientes', String(data.total));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando resumen de cotizaciones:', err);
        this.actualizarCard('Cotizaciones pendientes', '0');
        this.cdr.detectChanges();
      }
    });
  }

  cargarResumenProveedores(): void {
    this.proveedorService.contarActivos().subscribe({
      next: (data) => {
        this.actualizarCard('Proveedores activos', String(data.total));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando resumen de proveedores:', err);
        this.actualizarCard('Proveedores activos', '0');
        this.cdr.detectChanges();
      }
    });
  }

  cargarResumenInventario(): void {
    this.inventarioService.resumen().subscribe({
      next: (data) => {
        const totalCriticos = data.totalStockBajo + data.totalSinStock;

        this.actualizarCard('Productos con stock bajo', String(totalCriticos));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando resumen de inventario:', err);
        this.actualizarCard('Productos con stock bajo', '0');
        this.cdr.detectChanges();
      }
    });
  }

  cargarResumenComprasPendientesPago(): void {
    const tamanioPagina = 100;

    this.compraService
      .listar('', '', '', '', 1, tamanioPagina)
      .subscribe({
        next: (primeraPagina) => {
          const totalPaginas = primeraPagina.totalPaginas ?? 1;

          if (totalPaginas <= 1) {
            const totalPendientes = this.contarComprasPendientesPago(primeraPagina.items ?? []);
            this.actualizarCard('Compras pendientes de pago', String(totalPendientes));
            this.cdr.detectChanges();
            return;
          }

          const solicitudes = [];

          for (let pagina = 2; pagina <= totalPaginas; pagina++) {
            solicitudes.push(
              this.compraService.listar('', '', '', '', pagina, tamanioPagina)
            );
          }

          forkJoin(solicitudes).subscribe({
            next: (paginasRestantes) => {
              let compras: CompraListado[] = [...(primeraPagina.items ?? [])];

              paginasRestantes.forEach((pagina) => {
                compras = compras.concat(pagina.items ?? []);
              });

              const totalPendientes = this.contarComprasPendientesPago(compras);

              this.actualizarCard('Compras pendientes de pago', String(totalPendientes));
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error cargando páginas de compras:', err);

              const totalPendientes = this.contarComprasPendientesPago(primeraPagina.items ?? []);
              this.actualizarCard('Compras pendientes de pago', String(totalPendientes));
              this.cdr.detectChanges();
            }
          });
        },
        error: (err) => {
          console.error('Error cargando resumen de compras pendientes:', err);
          this.actualizarCard('Compras pendientes de pago', '0');
          this.cdr.detectChanges();
        }
      });
  }

  cargarMovimientosRecientes(): void {
    this.inventarioService.listarMovimientosRecientes(3).subscribe({
      next: (data) => {
        this.movimientosRecientes = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando movimientos recientes:', err);
        this.movimientosRecientes = [];
        this.cdr.detectChanges();
      }
    });
  }

  obtenerSignoMovimiento(tipoMovimiento: string): string {
    const tipo = tipoMovimiento.toLowerCase();

    if (tipo === 'entrada') {
      return '+';
    }

    if (tipo === 'salida') {
      return '-';
    }

    return '±';
  }

  private contarComprasPendientesPago(compras: CompraListado[]): number {
    return compras.filter((compra) => {
      const estadoCompra = (compra.estadoCompra || '').toLowerCase();
      const saldoPendiente = Number(compra.saldoPendiente || 0);

      return !estadoCompra.includes('anulada') && saldoPendiente > 0;
    }).length;
  }

  private actualizarCard(label: string, value: string): void {
    this.cards = this.cards.map((card) => {
      if (card.label === label) {
        return {
          ...card,
          value
        };
      }

      return card;
    });
  }
}