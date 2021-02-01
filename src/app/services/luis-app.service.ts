import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
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
  private endpointApp = "/luis/app";

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
    return this.httpClient.delete(this.buildUrl("/deleteApp"),{ params: { name: appName, force: String(force)}, observe: 'response' });
  }

  public trainApp(appName: string): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.buildUrl("/train?name="+appName), {observe: 'response' , headers: new HttpHeaders({ "Content-Type": 'application/json'}), responseType: 'text' as 'json'  });
  }

  public createApp(json: string) {
    return this.httpClient.post<string>(this.baseUrl + "/luis/service/createApp", json, { observe:'response' , headers: new HttpHeaders({ "Content-Type": 'application/json'}), responseType: 'text' as 'json' });
  }

  public publish(name: string, staging: boolean) {
    return this.httpClient.post<string>(this.buildUrl("/publish/?name="+name+"&staging="+staging),{ headers: new HttpHeaders({ "Content-Type": 'text/plain; charset=utf-8' }), params: { "staging": String(staging) }, responseType: 'text' as 'json' });
  }

  public getPublishSettings(name: string) {
    return this.httpClient.get<string>(this.buildUrl("/getPublishSettings/?name="+name), { observe:'response' , headers: new HttpHeaders({ "Content-Type": 'application/json'}), responseType: 'text' as 'json' });
  }

  public getAppInfo(name: string) {
    return this.httpClient.get<string>(this.buildUrl("/getAppInfo/?name="+name), { observe:'response' , headers: new HttpHeaders({ "Content-Type": 'application/json'}), responseType: 'text' as 'json' });
  }

  public batchTestApp(appName: string, intent: string): Observable<Array<LuisAppStats>> {
    return this.httpClient.post<Array<LuisAppStats>>(this.buildUrl("/batchTest"),null, { params: { name: appName, intent: intent } });
  }

  public getGT(): Observable<string> {
    return this.httpClient.get<string>( this.baseUrl + this.endpointApp + "/getGT", { headers: new HttpHeaders({ "Content-Type": 'text/plain; charset=utf-8' }), responseType: 'text' as 'json' });
  }

  private buildUrl(uri: string): string {
    return this.baseUrl + this.endpoint + uri;
  }

}
