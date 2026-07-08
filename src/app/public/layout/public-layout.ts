import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss'
})
export class PublicLayoutComponent implements OnInit, OnDestroy {
  menuAbierto = false;
  busquedaGlobal = '';

  clienteLogueado = false;
  cantidadCarrito = 0;

  private actualizarCarritoHandler = () => {
    this.verificarSesionCliente();
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.verificarSesionCliente();

    window.addEventListener('storage', this.actualizarCarritoHandler);
    window.addEventListener('carritoCotizacionActualizado', this.actualizarCarritoHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.actualizarCarritoHandler);
    window.removeEventListener('carritoCotizacionActualizado', this.actualizarCarritoHandler);
  }

  verificarSesionCliente(): void {
    const sesionCliente = localStorage.getItem('clienteWebSesion');
    const carrito = localStorage.getItem('carritoCotizacion3S');

    this.clienteLogueado = !!sesionCliente;
    this.cantidadCarrito = 0;

    if (!carrito) {
      return;
    }

    try {
      const items = JSON.parse(carrito);

      if (Array.isArray(items)) {
        this.cantidadCarrito = items.reduce((total, item) => {
          const cantidad = Number(item?.cantidad || 1);
          return total + (cantidad > 0 ? cantidad : 1);
        }, 0);
      }
    } catch {
      this.cantidadCarrito = 0;
    }
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  buscarDesdeMenu(): void {
    const texto = this.busquedaGlobal.trim();

    this.router.navigate(['/productos'], {
      queryParams: texto ? { q: texto } : {}
    });

    this.cerrarMenu();
  }

  irCarrito(): void {
    this.router.navigate(['/cliente/carrito']);
  }

  irClienteLogin(): void {
    this.router.navigate(['/cliente/login']);
  }

  abrirWhatsAppGeneral(): void {
    const telefono = '51948327667';
    const mensaje = 'Hola, deseo información sobre los productos y servicios industriales de 3S.';
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, '_blank');
  }
}