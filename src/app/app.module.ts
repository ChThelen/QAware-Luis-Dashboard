import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TilesComponent } from './components/tiles/tiles.component';
import { DetailViewComponent } from './components/detail-view/detail-view.component';
import { ManageViewComponent } from './components/manage-view/manage-view.component';
import { DeployJsonComponent } from './components/deploy-json/deploy-json.component';
import { GroundTruthComponent } from './components/ground-truth/ground-truth.component';
import { EditableCellComponent } from './components/editable-cell/editable-cell.component';
import { NotificationComponent } from './components/notification/notification.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { ChartsModule } from 'ng2-charts';
import { CdsModule } from '@cds/angular';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TilesComponent,
    DetailViewComponent,
    ManageViewComponent,
    DeployJsonComponent,
    GroundTruthComponent,
    EditableCellComponent,
    NotificationComponent,
    DashboardComponent,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    HighlightModule,
    ChartsModule,
    CdsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'),
        languages: {
          json: () => import('highlight.js/lib/languages/json')
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
