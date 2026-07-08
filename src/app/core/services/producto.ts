import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ProductoActualizar,
  ProductoCrear,
  ProductoListado
} from '../models/producto.model';
import { ResultadoPaginado } from '../models/resultado-paginado.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private readonly apiUrl = `${environment.apiUrl}/producto`;

  constructor(private http: HttpClient) {}

  listar(
    buscar?: string,
    pagina: number = 1,
    tamanioPagina: number = 10
  ): Observable<ResultadoPaginado<ProductoListado>> {
    let params = new HttpParams()
      .set('pagina', String(pagina))
      .set('tamanioPagina', String(tamanioPagina));

    if (buscar && buscar.trim().length > 0) {
      params = params.set('buscar', buscar.trim());
    }

    return this.http.get<ResultadoPaginado<ProductoListado>>(this.apiUrl, { params });
  }

  crear(producto: ProductoCrear): Observable<ProductoListado> {
    return this.http.post<ProductoListado>(this.apiUrl, producto);
  }

  actualizar(idProducto: number, producto: ProductoActualizar): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${idProducto}`, producto);
  }

  eliminar(idProducto: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${idProducto}`);
  }
  
  contarActivos() {
  return this.http.get<{ total: number }>(`${this.apiUrl}/total-activos`);
}
}