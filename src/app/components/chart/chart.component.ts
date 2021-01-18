import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input()
  chartLabels: string[];
  @Input()
  chartData:  ChartDataSets[];
  
  chartLegend = false;
  
  chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  
  chartColors: Color[] = [
    {
      backgroundColor: 'rgba(0,54,77,0.28)',
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
