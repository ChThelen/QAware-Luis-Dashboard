import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TilesComponent } from './components/tiles/tiles.component';
import { DetailViewComponent } from './components/detail-view/detail-view.component';
import { ManageViewComponent } from './components/manage-view/manage-view.component';
import { CsvReaderComponent } from './components/csv-reader/csv-reader.component';


const routes: Routes = [
  { path: 'dashboard', component: TilesComponent },
  { path: 'manage', component: ManageViewComponent },
  { path: 'manage/:id', component: DetailViewComponent },
  { path: 'import', component: CsvReaderComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }