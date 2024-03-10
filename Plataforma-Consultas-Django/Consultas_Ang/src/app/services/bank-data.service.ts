import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankData } from '../models/bankData';

@Injectable({
  providedIn: 'root'
})
export class BankDataService {

  constructor(private http: HttpClient) { }

  getBancoData2(banco: string): Observable<BankData[]> {
    return this.http.get<BankData[]>(`assets/${banco}.json`);
  }

  // getBancoData(banco: string): Observable<BankData[]> {
  //   return this.http.get<BankData[]>(`http://localhost:8000/api/aportaciones/?entidad=${banco}`);
  // }

  getBancoData(banco: string, token: string): Observable<BankData[]> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http
      .get<any[]>(`http://localhost:8000/api/aportaciones/?entidad=${banco}`, { headers })
      
  }
  
}
