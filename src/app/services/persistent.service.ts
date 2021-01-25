import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/runtime-environment';
import { LuisApp } from '../models/LuisApp';
import { LuisAppStats } from '../models/LuisAppStats';

@Injectable({
  providedIn: 'root'
})
export class PersistentService {

  private baseUrl = environment.backendUrl;
  private endpoint = "/luis/app";

  constructor(private httpClient: HttpClient) { }
  
  public getApps(): Observable<Array<LuisApp>> {
    return this.httpClient.get<Array<LuisApp>>(this.buildUrl("/getApps"));
  }

  public getAppJSON(appName: string): Observable<string> {
    return this.httpClient.get<string>(this.buildUrl("/getJSON"), { params: { "name": appName } });
  }

  public getAppStats(appName: string): Observable<Array<LuisAppStats>> {
    return this.httpClient.get<Array<LuisAppStats>>(this.buildUrl("/getAppStats"), { params: { "name": appName } });
  }

  public merge(csv: string): Observable<string> {
    const body = { title: csv }
    return this.httpClient.put<string>(this.buildUrl("/addRecords"), body, { headers: new HttpHeaders({ "Content-Type": 'text/plain; charset=utf-8' }), responseType: 'text' as 'json' });
  }

  public changeGT(csv: string): Observable<string> {
    return this.httpClient.put<string>(this.buildUrl("/changeGT"), csv, { headers: new HttpHeaders({ "Content-Type": 'text/plain; charset=utf-8' }), responseType: 'text' as 'json' });
  }

  public getGT(): Observable<string> {
    return this.httpClient.get<string>(this.buildUrl("/getGT"), { headers: new HttpHeaders({ "Content-Type": 'text/plain; charset=utf-8' }), responseType: 'text' as 'json' });
  }

  private buildUrl(uri: string): string {
    return this.baseUrl + this.endpoint + uri;
  }

}
