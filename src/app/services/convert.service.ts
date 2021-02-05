import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/runtime-environment';

@Injectable({
  providedIn: 'root'
})
export class ConvertService {

  private baseUrl = environment.backendUrl;
  private endpoint = "/luis/convert";

  constructor(private httpClient: HttpClient) { }

  public convertCsvToJson(csv: string, name: string, description?: string, version?: string): Observable<string> {
    return this.httpClient.post<string>(this.buildUrl("/convertToJSON"), csv, { headers: new HttpHeaders({ "Content-Type": "application/json" }), params: { "name": name, version: version, desc: description } });
  }

  public convertJsonToCSV(json: string): Observable<string> {
    return this.httpClient.post(this.buildUrl("/convertToCSV"), json, {responseType: "text"});
  }

  private buildUrl(uri: string): string {
    return this.baseUrl + this.endpoint + uri;
  }
  
}
