import { Injectable, Version } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { environment } from '../../environments/runtime-environment';
import { Observable } from 'rxjs';
import { Intent } from '../models/Intent';
import { Utterance } from '../models/Utterance';
import { Entity } from '../models/Entity';
import { LuisAppStats } from '../models/LuisAppStats';

@Injectable({
  providedIn: 'root'
})
export class LuisAppService {

  private baseUrl = environment.backendUrl;
  private endpoint = "/luis/service";

  constructor(private httpClient: HttpClient) { }

  public addIntent(appName: string, intent: Intent): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.buildUrl("/addIntent"), intent, { headers: new HttpHeaders({ "Content-Type": "application/json" }), params: { name: appName }, observe: 'response' });
  }

  public addUtterances(appName: string, utterances: Array<Utterance>): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.buildUrl("/addUtterances"), utterances, { headers: new HttpHeaders({ "Content-Type": "application/json" }), params: { name: appName }, observe: 'response' });
  }

  public addEntity(appName: string, entity: Entity): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.buildUrl("/addEntity"), entity, { headers: new HttpHeaders({ "Content-Type": "application/json" }), params: { name: appName }, observe: 'response' });
  }

  public getHitCount(appName: string): Observable<number> {
    return this.httpClient.get<number>(this.buildUrl("/getHitCount"), { params: { name: appName } });
  }

  public getSimpleHit(appName: string, utterance: string): Observable<string> {
    return this.httpClient.get<string>(this.buildUrl("/simpleHit"), { params: { name: appName, utterance: utterance } });
  }

  public deleteApp(appName: string, force: boolean = true): Observable<HttpResponse<any>> {
    return this.httpClient.delete(this.buildUrl("/deleteApp"),{ params: { name: appName, force: String(force)}, observe: 'response' });
  }

  public trainApp(appName: string): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.buildUrl("/train"),null, {params: {name: appName}, observe: 'response'});
  }

  public createApp(json: string): Observable<string> {
    return this.httpClient.post<string>(this.buildUrl("createApp"), json, { headers: new HttpHeaders({ "Content-Type": 'text/plain; charset=utf-8' }), responseType: 'text' as 'json' });
  }

  public publish(appName: string, staging: boolean): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.buildUrl("/publish"), null, { headers: new HttpHeaders({ "Content-Type": 'text/plain; charset=utf-8' }), params: { name: appName, staging: String(staging) }, observe: 'response' });
  }

  public getPublishSettings(appName: string): Observable<string> {
    return this.httpClient.get<string>(this.buildUrl("/getPublishSettings"), { headers: new HttpHeaders({ "Content-Type": 'text/plain; charset=utf-8' }), params: {name: appName}, responseType: 'text' as 'json' });
  }

  public batchTestApp(appName: string, intent: string): Observable<Array<LuisAppStats>> {
    return this.httpClient.post<Array<LuisAppStats>>(this.buildUrl("/batchTest"),null, { params: { name: appName, intent: intent } });
  }

  public getTestData(appName: string): Observable<Array<any>> {
    return this.httpClient.get<any>(this.buildUrl("/getTestDataJSON"), { params: { name: appName } });
  }

  public testData(csv: string, name: string): Observable<string> {
    return this.httpClient.post<string>(this.buildUrl("/testData"), csv, { headers: new HttpHeaders({ "Content-Type": "application/json" }), params: { "name": name } });
  }
  
  public autoData(csv: string, name: string,version:string,desc:string, culture:string): Observable<string> {
    return this.httpClient.post<string>(this.buildUrl("/testData"), csv, { headers: new HttpHeaders({ "Content-Type": "application/json" }),
     params: { "name": name , "version": version,"desc": desc, "culture":culture } });
  }
  
  private buildUrl(uri: string): string {
    return this.baseUrl + this.endpoint + uri;
  }

}
