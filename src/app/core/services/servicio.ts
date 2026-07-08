import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ResultadoPaginado } from '../models/resultado-paginado.model';
import {
  ServicioActualizar,
  ServicioCrear,
  ServicioListado
} from '../models/servicio.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private readonly apiUrl = `${environment.apiUrl}/servicio`;

  constructor(private http: HttpClient) {}

  listar(
    buscar?: string,
    pagina: number = 1,
    tamanioPagina: number = 5
  ): Observable<ResultadoPaginado<ServicioListado>> {
    let params = new HttpParams()
      .set('pagina', String(pagina))
      .set('tamanioPagina', String(tamanioPagina));

    if (buscar && buscar.trim().length > 0) {
      params = params.set('buscar', buscar.trim());
    }

    return this.http.get<ResultadoPaginado<ServicioListado>>(this.apiUrl, { params });
  }

  crear(servicio: ServicioCrear): Observable<ServicioListado> {
    return this.http.post<ServicioListado>(this.apiUrl, servicio);
  }

  actualizar(idServicio: number, servicio: ServicioActualizar): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${idServicio}`, servicio);
  }

  eliminar(idServicio: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${idServicio}`);
  }
  contarActivos() {
  return this.http.get<{ total: number }>(`${this.apiUrl}/total-activos`);
}
}