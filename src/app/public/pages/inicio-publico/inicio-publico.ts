import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface CategoriaPublica {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
}

interface ProductoPublico {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  marca: string;
  descripcion: string;
  cantidad: number;
  nuevo: boolean;
  imagenUrl: string;
}

interface ServicioPublico {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  imagenUrl: string;
}

@Component({
  selector: 'app-inicio-publico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio-publico.html',
  styleUrl: './inicio-publico.scss'
})
export class InicioPublicoComponent implements OnInit, AfterViewInit, OnDestroy {
  busqueda = '';

  private observadorSecciones?: IntersectionObserver;

  categorias: CategoriaPublica[] = [
    {
      id: 1,
      nombre: 'Generación de vapor',
      descripcion: 'Productos y soluciones para sistemas de vapor industrial.',
      icono: '♨'
    },
    {
      id: 2,
      nombre: 'Instrumentación y automatización',
      descripcion: 'Control, medición, sensores y automatización industrial.',
      icono: '⚙'
    },
    {
      id: 3,
      nombre: 'Mantenimiento industrial',
      descripcion: 'Herramientas, equipos y soporte para mantenimiento técnico.',
      icono: '🛠'
    },
    {
      id: 4,
      nombre: 'Repuestos industriales',
      descripcion: 'Componentes y repuestos para continuidad operativa.',
      icono: '🔩'
    }
  ];

  productos: ProductoPublico[] = [
    {
      id: 1,
      codigo: 'GV-001',
      nombre: 'Válvula para línea de vapor',
      categoria: 'Generación de vapor',
      marca: 'SUN',
      descripcion: 'Componente para control y operación de sistemas de vapor.',
      cantidad: 1,
      nuevo: true,
      imagenUrl: ''
    },
    {
      id: 2,
      codigo: 'IA-018',
      nombre: 'Sensor industrial de proximidad',
      categoria: 'Instrumentación y automatización',
      marca: 'Honeywell',
      descripcion: 'Sensor para detección en líneas de producción.',
      cantidad: 1,
      nuevo: true,
      imagenUrl: ''
    },
    {
      id: 3,
      codigo: 'MI-004',
      nombre: 'Kit de herramientas de mantenimiento',
      categoria: 'Mantenimiento industrial',
      marca: '3S',
      descripcion: 'Kit técnico para mantenimiento preventivo y correctivo.',
      cantidad: 1,
      nuevo: true,
      imagenUrl: ''
    },
    {
      id: 4,
      codigo: 'RI-027',
      nombre: 'Terminal eléctrico de conexión',
      categoria: 'Repuestos industriales',
      marca: 'Novus',
      descripcion: 'Terminal para conexiones eléctricas seguras.',
      cantidad: 1,
      nuevo: true,
      imagenUrl: ''
    }
  ];

  servicios: ServicioPublico[] = [
    {
      id: 1,
      nombre: 'Mantenimiento industrial',
      descripcion: 'Soporte técnico preventivo y correctivo para equipos industriales.',
      icono: '🧰',
      imagenUrl: ''
    },
    {
      id: 2,
      nombre: 'Automatización de procesos',
      descripcion: 'Implementación y mejora de sistemas de control industrial.',
      icono: '⚙',
      imagenUrl: ''
    },
    {
      id: 3,
      nombre: 'Instalación de equipos',
      descripcion: 'Montaje, configuración y puesta en marcha de equipos técnicos.',
      icono: '🏭',
      imagenUrl: ''
    },
    {
      id: 4,
      nombre: 'Soporte técnico especializado',
      descripcion: 'Asistencia para operación, diagnóstico y continuidad industrial.',
      icono: '🛡',
      imagenUrl: ''
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const texto = params.get('q');

      if (texto) {
        this.busqueda = texto;

        setTimeout(() => {
          document.getElementById('catalogo')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.inicializarEfectoSecciones();
    }, 0);
  }

  ngOnDestroy(): void {
    this.observadorSecciones?.disconnect();
  }

  get productosNuevos(): ProductoPublico[] {
    return this.productos.filter(producto => producto.nuevo);
  }

  productosPorCategoria(categoria: string): ProductoPublico[] {
    return this.productos
      .filter(producto => producto.categoria === categoria)
      .slice(0, 4);
  }

  normalizarCantidad(producto: ProductoPublico): void {
    producto.cantidad = Number(producto.cantidad || 1);

    if (producto.cantidad < 1) {
      producto.cantidad = 1;
    }

    producto.cantidad = Math.floor(producto.cantidad);
  }

  abrirWhatsAppProducto(producto: ProductoPublico): void {
    this.normalizarCantidad(producto);

    const telefono = '51948327667';

    const mensaje = [
      'Hola, quiero cotizar este producto:',
      '',
      `Producto: ${producto.nombre}`,
      `Código: ${producto.codigo}`,
      `Categoría: ${producto.categoria}`,
      `Marca: ${producto.marca}`,
      `Cantidad: ${producto.cantidad}`,
      '',
      'Quedo atento a la disponibilidad y precio.'
    ].join('\n');

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, '_blank');
  }

  abrirWhatsAppServicio(servicio: ServicioPublico): void {
    const telefono = '51948327667';

    const mensaje = [
      'Hola, deseo información sobre este servicio:',
      '',
      `Servicio: ${servicio.nombre}`,
      `Detalle: ${servicio.descripcion}`,
      '',
      'Quedo atento a su respuesta.'
    ].join('\n');

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, '_blank');
  }

  abrirWhatsAppGeneral(): void {
    const telefono = '51948327667';
    const mensaje = 'Hola, deseo información sobre los productos y servicios industriales de 3S.';
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, '_blank');
  }

  private inicializarEfectoSecciones(): void {
    if (!('IntersectionObserver' in window)) {
      return;
    }

    const secciones = Array.from(
      document.querySelectorAll<HTMLElement>('.seccion-scroll')
    );

    if (secciones.length === 0) {
      return;
    }

    this.observadorSecciones = new IntersectionObserver(
      entradas => {
        entradas.forEach(entrada => {
          if (!entrada.isIntersecting) {
            return;
          }

          secciones.forEach(seccion => {
            seccion.classList.remove('section-active');
          });

          entrada.target.classList.add('section-active');
        });
      },
      {
        threshold: 0.35,
        rootMargin: '-18% 0px -40% 0px'
      }
    );

    secciones.forEach(seccion => {
      this.observadorSecciones?.observe(seccion);
    });
  }
}