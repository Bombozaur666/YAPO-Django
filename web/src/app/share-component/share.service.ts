import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {host} from '../shared/setup/host';
import {Observable} from 'rxjs';
import {Plant} from '../Interfaces/Plants/plant';

@Injectable({
  providedIn: 'root'
})

export class ShareService {
  protected baseUrl: string = `${host.protocol}${host.hostname}:${host.port}/`;

  constructor(private http: HttpClient) {}


  getPlant(plantId: string | null): Observable<Plant> {
    return this.http.get<Plant>(`${this.baseUrl}plants/shared/${plantId}`);
  }
}
