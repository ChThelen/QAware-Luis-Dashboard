import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/runtime-environment';
import { Observable } from 'rxjs';
import {LuisApp} from '../models/LuisApp';
 
import {catchError} from "rxjs/internal/operators"

@Injectable({
  providedIn: 'root'
})
export class LuisAppService {

  private baseUrl = environment.backendUrl;
  private endpoint = "/apps";

  private httpOptions = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };

  constructor(private httpClient: HttpClient) { }

  public getApps(): Observable<any> {
    const url = this.baseUrl + this.endpoint;
    return this.httpClient.get<LuisApp>(url, this.httpOptions);
  }

  public getApp(luisAppId: string): Observable<any> {
    const url = this.baseUrl + this.endpoint + `/${luisAppId}`;
    return this.httpClient.get<LuisApp>(url, this.httpOptions);
  }
  public convertCsvToJson(csv:string,name:string):Observable<string> 
  {   
      return this.httpClient.post<string>(this.baseUrl+"/luis/convert/convertToJSON?name="+name, csv, {headers: new HttpHeaders({"Content-Type": "application/json"})});  
  }
  public convertJsonToCSV(json:string):Observable<string> 
  {   
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
      return this.httpClient.post<string>(this.baseUrl+"/luis/convert/convertToCSV", json, {headers: new HttpHeaders({"Content-Type": 'text/plain; charset=utf-8'}),responseType:'text' as 'json'});    
  }
  /**
   * 
   * @param json 
   * @returns App Id
   */
  public createApp(json:string)
  {
    return this.httpClient.post<string>(this.baseUrl+"/luis/service/createApp", json, {headers: new HttpHeaders({"Content-Type": 'text/plain; charset=utf-8'}),responseType:'text' as 'json'});
  }
   /**
     * Starts the training for an Luis app and waits for it to end
     * @param name name of the app
     * @return 0 if successful, 1 else
     */
  public train(name:string)
  {
    return this.httpClient.post<number>(this.baseUrl+"/luis/service/train", name, {headers: new HttpHeaders({"Content-Type": 'text/plain; charset=utf-8'}),responseType:'text' as 'json'});
  }
  public publish(name:string,staging:boolean)
  {
    return this.httpClient.post<number>(this.baseUrl+"/luis/service/publish?staging="+staging, name, {headers: new HttpHeaders({"Content-Type": 'text/plain; charset=utf-8'}),responseType:'text' as 'json'});
  }
  public getPublishSettings(name:string)
  {
    return this.httpClient.post<string>(this.baseUrl+"/luis/service/getPublishSettings", name, {headers: new HttpHeaders({"Content-Type": 'text/plain; charset=utf-8'}),responseType:'text' as 'json'});
  }

}
