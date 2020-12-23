import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Book } from '../models/book';
import { environment } from '../../environments/runtime-environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {


  private authToken = environment.token;
  private baseUri = "http://localhost:8081/secure";

  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: this.authToken
    }).append('Content-Type', 'application/json')
  };


  constructor(
    private http: HttpClient
  ) {}


    // GET ALL BOOKS
   public getAllBooks(): Observable<any> {
    const url = this.baseUri + "/books";
    return this.http.get<Book>(url, this.httpOptions);
  }

   // GET ONE BOOK
   public getBook(id: string): Observable<any> {
    const url = this.baseUri + "/books/" + id;
    return this.http.get<Book>(url, this.httpOptions);
  }


   // INSERT BOOK
   public addBook(book: Book): Observable<any> {
    const url = this.baseUri + "/books";
    const body = JSON.stringify(book);
    return this.http.post<Book>(url, body, this.httpOptions);
  }
   
    // DELETE BOOK
    public deleteBook(id: string): Observable<any> {
      const url = this.baseUri + "/books/" + id;
      return this.http.delete<Book>(url, this.httpOptions);
    }











  /*
  Endpoints (POST, DELETE, GET):
http://localhost:8081/secure/books

http://localhost:8081/secure/books/{id}

 
Book Entity:

{
        "name": "Steve Jobs: A Biography",
        "isbn": "978-1451648539",
        "pages": "697",
        "author": "Walter Isaacson"
}
  
  
  */






}
