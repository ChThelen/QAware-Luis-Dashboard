import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TilesComponent } from './components/tiles/tiles.component';
import { DetailViewComponent } from './components/detail-view/detail-view.component';
import { ManageViewComponent } from './components/manage-view/manage-view.component';

@NgModule({
  declarations: [
    AppComponent,
    TilesComponent,
    DetailViewComponent,
    ManageViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
