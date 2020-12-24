import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LuisApp } from '../../models/LuisApp';
import { DUMMY_APPS } from '../../models/LuisApp';
import { LuisAppService } from '../../services/luis-app.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {

  luisApp: LuisApp;

  constructor(private route: ActivatedRoute, private luisAppService: LuisAppService) { }

  ngOnInit(): void {
    this.getApp();
  }
  
  getApp(): void {
  /* Uncomment when backend service is available
    const id = this.route.snapshot.paramMap.get('id');
    this.luisAppService.getApp(id).subscribe(k => {
      this.luisApp = k;
    });
  */

    //DUMMY DATA REMOVE LATER
    this.luisApp = DUMMY_APPS[0];

  }

}
