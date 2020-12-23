import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationService } from './services/notification.service';
import { NotificationBannerComponent } from './components/notification-banner/notification-banner.component';
import { ExampleComponent } from './components/example/example.component';
import { DbExampleInteractionComponent } from './components/db-example-interaction/db-example-interaction.component';
import { BookService } from './services/book.service';

@NgModule({
  declarations: [
    AppComponent,
    NotificationBannerComponent,
    ExampleComponent,
    DbExampleInteractionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [NotificationService, BookService],
  bootstrap: [AppComponent]
})
export class AppModule { }
