import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailViewComponent } from './components/detail-view/detail-view.component';
import { CsvReaderComponent } from './components/csv-reader/csv-reader.component';
import { GroundTruthComponent } from './ground-truth/ground-truth.component';
import { DeployJsonComponent } from './components/deploy-json/deploy-json.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'apps/:name', component: DetailViewComponent },
  { path: 'groundTruth', component: GroundTruthComponent },
  { path: 'deploy', component: DeployJsonComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }