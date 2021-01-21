import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { environment } from '../../environments/runtime-environment';
import { Observable } from 'rxjs';
import { LuisApp } from '../models/LuisApp';
import { LuisAppStats } from '../models/LuisAppStats';
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

  public getApps(): Observable<Array<LuisApp>> {
    return this.httpClient.get<Array<LuisApp>>(this.buildUrl("/getApps"));
  }

  public addIntent(appName: string, intent: Intent): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.buildUrl("/addIntent"), intent, { headers: new HttpHeaders({ "Content-Type": "application/json" }), params: { "name": appName }, observe: 'response' });
  }

  public addUtterances(appName: string, utterances: Array<Utterance>): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.buildUrl("/addUtterances"), utterances, { headers: new HttpHeaders({ "Content-Type": "application/json" }), params: { "name": appName }, observe: 'response' });
  }

  public addEntity(appName: string, entity: Entity): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.buildUrl("/addEntity"), entity, { headers: new HttpHeaders({ "Content-Type": "application/json" }), params: { "name": appName }, observe: 'response' });
  }

  public getAppJSON(appName: string): Observable<string> {
    return this.httpClient.get<string>(this.buildUrl("/getJSON"), { params: { "name": appName } });
  }

  public getHitCount(appName: string): Observable<number> {
    return this.httpClient.get<number>(this.buildUrl("/getHitCount"), { params: { "name": appName } });
  }

  public getSimpleHit(appName: string, utterance: string): Observable<string> {
    return this.httpClient.get<string>(this.buildUrl("/simpleHit"), { params: { "name": appName, utterance: utterance } });
  }

  public getAppStats(appName: string): Observable<Array<LuisAppStats>> {
    return this.httpClient.get<Array<LuisAppStats>>(this.buildUrl("/getAppStats"), { params: { "name": appName } });
  }

  public deleteApp(appName: string, force: boolean = true): Observable<HttpResponse<any>> {
    return this.httpClient.delete(this.buildUrl("/deleteApp"), { params: new HttpParams().set("name", appName).set("force", String(force)), observe: 'response' });
  }

  public trainApp(appName: string): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.buildUrl("/train"), { params: { "name": appName }, observe: 'response' });
  }

  public convertCsvToJson(csv: string, name: string): Observable<string> {
    return this.httpClient.post<string>(this.baseUrl + "/luis/convert/convertToJSON", csv, { headers: new HttpHeaders({ "Content-Type": "application/json" }), params: { "name": name } });
  }

  public convertJsonToCSV(json: string): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.httpClient.post<string>(this.baseUrl + "/luis/convert/convertToCSV", json, { headers: new HttpHeaders({ "Content-Type": 'text/plain; charset=utf-8' }), responseType: 'text' as 'json' });
  }

  public createApp(json: string) {
    return this.httpClient.post<string>(this.baseUrl + "/luis/service/createApp", json, { headers: new HttpHeaders({ "Content-Type": 'text/plain; charset=utf-8' }), responseType: 'text' as 'json' });
  }

  public publish(name: string, staging: boolean) {
    return this.httpClient.post<number>(this.buildUrl("/publish"), name, { headers: new HttpHeaders({ "Content-Type": 'text/plain; charset=utf-8' }), params: { "staging": String(staging) }, responseType: 'text' as 'json' });
  }

  public getPublishSettings(name: string) {
    return this.httpClient.post<string>(this.buildUrl("/getPublishSettings"), name, { headers: new HttpHeaders({ "Content-Type": 'text/plain; charset=utf-8' }), responseType: 'text' as 'json' });
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
