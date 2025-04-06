import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { BalanceData } from '../interfaces/balance-data.interface';
import { CreateLinkTokenResponse } from '../interfaces/create-link-token-response.interface';
import { RefreshAllBalancesResponse } from '../interfaces/refresh-all-balances-response.interface';

@Injectable({
  providedIn: 'root',
})
export class PlaidService {
  private readonly apiUrl = `${environment.apiUrl}/plaid`;

  constructor(private readonly http: HttpClient) {
  }

  getBalance(id: number): Observable<BalanceData> {
    return this.http.get<BalanceData>(`${this.apiUrl}/${id}/balance/get`);
  }

  createAndSendLinkToken(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/link/token/create-and-send`);
  }

  refreshAllBalances(): Observable<RefreshAllBalancesResponse> {
    return this.http.get<RefreshAllBalancesResponse>(`${this.apiUrl}/all/balance/get`);
  }
}
