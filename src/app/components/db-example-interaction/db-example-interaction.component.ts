import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { Book } from 'src/app/models/book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-db-example-interaction',
  templateUrl: './db-example-interaction.component.html',
  styleUrls: ['./db-example-interaction.component.scss']
})
export class DbExampleInteractionComponent implements OnInit {

  books$: Observable<Array<Book>> | null;  
  books: Array<Book> = []; 

  public addBookName = "";
  public addBookAuthor = "";
  public addBookPages = 0;
  public addBookIsbn = "";

  constructor(private library: BookService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(){
    this.books = [];

    /*// GET LOCAL
    setTimeout(() => {
      this.books = this.generateLocalBooks();
    }, 25);
    */

     //GET FROM POSTGRES
    this.library.getAllBooks().subscribe(k => {
      this.books = k;
    });
    
  }

  deleteBook(id: string){
    this.library.deleteBook(id).subscribe(k => {
      this.loadBooks();
    });
  }

  insertBook(){

    const book = {
      name: this.addBookName,
      author: this.addBookAuthor,
      pages: this.addBookPages,
      isbn: this.addBookIsbn
    };

    this.library.addBook(book).subscribe(k => {
      this.loadBooks();
      this.addBookName = "";
      this.addBookAuthor = "";
      this.addBookPages = 0;
      this.addBookIsbn = "";
    });

  }








  // test code to create books locally

  generateLocalBooks(): Array<Book>{

    var localBooks = Array<Book>();
  
    for (let i = 0; i < 100; i++) {
      const b = this.makeBook(Number(Math.floor(Math.random() * Math.floor(10000))), this.randomString(10), this.randomString(5), this.randomString(4));
      localBooks = localBooks.concat(b);
    }
    return localBooks;
  }

  makeBook(pages: number, author: string, name: string, isbn: string){
    const book : Book = {
      name: name,
      author: author,
      pages: pages,
      isbn: isbn
    };
    return book;
   }

   randomString(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

 // test code end










}
