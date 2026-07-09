import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CotizacionWebResumen } from '../../../core/models/cotizacion-web.model';
import { ClienteWebSesion } from '../../../core/models/cliente-web.model';
import { ClienteWebService } from '../../../core/services/cliente-web.service';
import { CotizacionWebService } from '../../../core/services/cotizacion-web.service';

@Component({
  selector: 'app-cliente-historial-cotizaciones-publico',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cliente-historial-cotizaciones-publico.html',
  styleUrl: './cliente-historial-cotizaciones-publico.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClienteHistorialCotizacionesPublicoComponent implements OnInit {
  sesion: ClienteWebSesion | null = null;

  cotizaciones: CotizacionWebResumen[] = [];

  pagina = 1;
  tamanioPagina = 10;
  totalRegistros = 0;
  hayMas = false;

  cargando = false;
  cargandoMas = false;
  error = '';

  constructor(
    private clienteWebService: ClienteWebService,
    private cotizacionWebService: CotizacionWebService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sesion = this.clienteWebService.obtenerSesion();

    if (!this.sesion) {
      this.router.navigate(['/cliente/login'], {
        queryParams: {
          returnUrl: '/cliente/historial-cotizaciones'
        }
      });

      return;
    }

    this.cargarHistorial(true);
  }

  cargarHistorial(reiniciar: boolean): void {
    this.error = '';

    if (reiniciar) {
      this.pagina = 1;
      this.cotizaciones = [];
      this.cargando = true;
    } else {
      this.cargandoMas = true;
    }

    this.cd.markForCheck();

    this.cotizacionWebService
      .listarCotizaciones(this.pagina, this.tamanioPagina)
      .subscribe({
        next: response => {
          const nuevasCotizaciones = response.items || [];

          this.cotizaciones = reiniciar
            ? nuevasCotizaciones
            : [...this.cotizaciones, ...nuevasCotizaciones];

          this.totalRegistros = response.totalRegistros || 0;
          this.hayMas = !!response.hayMas;

          this.cargando = false;
          this.cargandoMas = false;
          this.cd.markForCheck();
        },
        error: error => {
          this.error =
            error?.error?.mensaje ||
            'No pudimos cargar tu historial de solicitudes. Intenta nuevamente.';

          this.cargando = false;
          this.cargandoMas = false;
          this.cd.markForCheck();
        }
      });
  }

  cargarMas(): void {
    if (!this.hayMas || this.cargandoMas) {
      return;
    }

    this.pagina += 1;
    this.cargarHistorial(false);
  }

  verDetalle(cotizacion: CotizacionWebResumen): void {
    this.router.navigate([
      '/cliente/historial-cotizaciones',
      cotizacion.idCotizacion
    ]);
  }

  seguirCotizando(): void {
    this.router.navigate(['/productos']);
  }

  obtenerEstadoCliente(estado: string): string {
    const valor = (estado || '').trim().toLowerCase();

    if (valor === 'pendiente') {
      return 'En revisión';
    }

    if (valor === 'respondida') {
      return 'Respondida por el equipo comercial';
    }

    if (valor === 'aprobada') {
      return 'Aprobada';
    }

    if (valor === 'cancelada') {
      return 'Cancelada';
    }

    if (valor === 'convertida en venta') {
      return 'Atendida';
    }

    return estado || 'En revisión';
  }

  obtenerClaseEstado(estado: string): string {
    const valor = (estado || '').trim().toLowerCase();

    if (valor === 'respondida') {
      return 'respondida';
    }

    if (valor === 'aprobada' || valor === 'convertida en venta') {
      return 'atendida';
    }

    if (valor === 'cancelada') {
      return 'cancelada';
    }

    return 'revision';
  }

  obtenerTextoProductos(cantidad: number): string {
    const total = Number(cantidad || 0);

    return `${total} producto${total === 1 ? '' : 's'} solicitado${total === 1 ? '' : 's'}`;
  }

  trackByCotizacion(_: number, cotizacion: CotizacionWebResumen): number {
    return cotizacion.idCotizacion;
  }
}