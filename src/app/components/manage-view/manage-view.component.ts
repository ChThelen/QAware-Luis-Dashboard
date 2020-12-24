import { Component, OnInit } from '@angular/core';
import {DUMMY_APPS} from '../../models/LuisApp';

@Component({
  selector: 'app-manage-view',
  templateUrl: './manage-view.component.html',
  styleUrls: ['./manage-view.component.scss']
})
export class ManageViewComponent implements OnInit {

  // DUMMY DATA REMOVE LATER
  apps = DUMMY_APPS;

  constructor() { }

  ngOnInit(): void {
  }

}
