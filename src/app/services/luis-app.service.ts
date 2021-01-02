import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from '../../environments/runtime-environment';
import { Observable } from 'rxjs';
import {LuisApp} from '../models/LuisApp';

@Injectable({
  providedIn: 'root'
})
export class LuisAppService {

  private baseUrl = environment.backendUrl;
  private endpoint = "/luis/service";

  constructor(private httpClient: HttpClient) { }

  public getApps(): Observable<any> {
    const url = this.baseUrl + this.endpoint + "/getApps";
    return this.httpClient.get<LuisApp>(url, {headers: new HttpHeaders({"Content-Type": "application/json"})});
  }

  public deleteApp(appName: string, force: boolean = true): Observable<any> {
    const url = this.baseUrl + this.endpoint + "/deleteApp";
    return this.httpClient.delete(url, {params: new HttpParams().set("name", appName).set("force", String(force))});
  }

}
