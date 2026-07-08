export interface InicioPublicoResponse {
  categorias: CategoriaPublica[];
  marcas: MarcaPublica[];
  productosNuevos: ProductoPublico[];
  productos: ProductoPublico[];
  servicios: ServicioPublico[];
}

export interface CategoriaPublica {
  id: number;
  idCategoria: number;
  nombre: string;
  descripcion: string;
  icono: string;
  cantidadProductos: number;
}

export interface MarcaPublica {
  id: number;
  idMarca: number;
  nombre: string;
  logoUrl: string;
  cantidadProductos: number;
}

export interface ImagenPublica {
  idImagen: number;
  urlImagen: string;
  textoAlternativo: string;
  esPrincipal: boolean;
}

export interface ProductoPublico {
  id: number;
  idProducto: number;
  idElementoCatalogo: number;
  idCategoria: number;
  idMarca: number | null;

  codigo: string;
  nombre: string;
  categoria: string;
  marca: string | null;
  descripcion: string;
  imagenUrl: string;

  nuevo: boolean;
  tieneFichaTecnica: boolean;
  fichaTecnicaPdf: string | null;

  cantidad: number;
}

export interface ProductoDetallePublico extends ProductoPublico {
  imagenes: ImagenPublica[];
}

export interface ProductoPublicoListado {
  items: ProductoPublico[];
  totalRegistros: number;
  pagina: number;
  tamanioPagina: number;
  totalPaginas: number;
  hayMas: boolean;
}

export interface ProductoPublicoFiltros {
  q?: string;
  idCategoria?: number | null;
  idMarca?: number | null;
  pagina?: number;
  tamanioPagina?: number;
}

export interface ServicioPublico {
  id: number;
  idServicio: number;
  idElementoCatalogo: number;

  nombre: string;
  descripcion: string;
  sectorAplicacion: string | null;
  mensajeWhatsApp: string | null;
  requiereVisitaTecnica: boolean;

  imagenUrl: string;
}

export interface ServicioDetallePublico extends ServicioPublico {
  imagenes: ImagenPublica[];
}