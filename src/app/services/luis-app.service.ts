import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { environment } from '../../environments/runtime-environment';
import { Observable } from 'rxjs';
import { Intent } from '../models/Intent';
import { Utterance } from '../models/Utterance';
import { Entity } from '../models/Entity';

@Injectable({
  providedIn: 'root'
})
export class LuisAppService {

  private baseUrl = environment.backendUrl;
  private endpoint = "/luis/service";

  constructor(private httpClient: HttpClient) { }

  public addIntent(appName: string, intent: Intent): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.buildUrl("/addIntent"), intent, { headers: new HttpHeaders({ "Content-Type": "application/json" }), params: { "name": appName }, observe: 'response' });
  }

  public addUtterances(appName: string, utterances: Array<Utterance>): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.buildUrl("/addUtterances"), utterances, { headers: new HttpHeaders({ "Content-Type": "application/json" }), params: { "name": appName }, observe: 'response' });
  }

  public addEntity(appName: string, entity: Entity): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.buildUrl("/addEntity"), entity, { headers: new HttpHeaders({ "Content-Type": "application/json" }), params: { "name": appName }, observe: 'response' });
  }
  
  public getHitCount(appName: string): Observable<number> {
    return this.httpClient.get<number>(this.buildUrl("/getHitCount"), { params: { "name": appName } });
  }

  public getSimpleHit(appName: string, utterance: string): Observable<string> {
    return this.httpClient.get<string>(this.buildUrl("/simpleHit"), { params: { "name": appName, utterance: utterance } });
  }

  public deleteApp(appName: string, force: boolean = true): Observable<HttpResponse<any>> {
    return this.httpClient.delete(this.buildUrl("/deleteApp"), { params: new HttpParams().set("name", appName).set("force", String(force)), observe: 'response' });
  }

  public trainApp(appName: string): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.buildUrl("/train"), { params: { "name": appName }, observe: 'response' });
  }

  public createApp(json: string): Observable<string>  {
    return this.httpClient.post<string>(this.buildUrl("createApp"), json, { headers: new HttpHeaders({ "Content-Type": 'text/plain; charset=utf-8' }), responseType: 'text' as 'json' });
  }

  public publish(name: string, staging: boolean): Observable<HttpResponse<any>>  {
    return this.httpClient.post<any>(this.buildUrl("/publish"), name, { headers: new HttpHeaders({ "Content-Type": 'text/plain; charset=utf-8' }), params: { "staging": String(staging) }, observe: 'response'});
  }

  public getPublishSettings(name: string): Observable<string>  {
    return this.httpClient.post<string>(this.buildUrl("/getPublishSettings"), name, { headers: new HttpHeaders({ "Content-Type": 'text/plain; charset=utf-8' }), responseType: 'text' as 'json' });
  }

  private buildUrl(uri: string): string {
    return this.baseUrl + this.endpoint + uri;
  }
  
}
