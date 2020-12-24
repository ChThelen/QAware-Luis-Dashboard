import { Component, OnInit } from '@angular/core';
import { LuisApp } from 'src/app/models/LuisApp';
import { DUMMY_APPS } from 'src/app/models/LuisApp';
import {LuisAppService} from 'src/app/services/luis-app.service';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.scss']
})
export class TilesComponent implements OnInit {

  apps: Array<LuisApp> = [];

  constructor(private luisAppService: LuisAppService) { }

  ngOnInit(): void {
    this.loadApps();
  }

  loadApps() {
    /* uncomment when backend service is available
    this.apps = [];
    this.luisAppService.getApps().subscribe(k => {
      this.apps = k;
    });
    */
    
    // DUMMY DATA REMOVE LATER
    this.apps = DUMMY_APPS;

  }

}
