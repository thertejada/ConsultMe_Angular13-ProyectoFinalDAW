import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { ChartData } from 'src/app/models';

const HEIGHT = 400;
const WIDTH_DIVISION_MOBILE = 1.2;
const WIDTH_DIVISION_DESKTOP = 1.6;

@Component({
  selector: 'app-vertical-bar-chart',
  templateUrl: './vertical-bar-chart.component.html',
  styleUrls: ['./vertical-bar-chart.component.scss']
})
export class VerticalBarChartComponent implements OnInit {
  @Input() public data: Array<ChartData>;
  @Input() public xAxisLabel: string;
  @Input() public yAxisLabel: string;
  @Input() public showLegend = true;

  public sizeView: [number, number];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showXAxisLabel = true;
  public showYAxisLabel = true;
  public colorScheme: Color = {
    domain: ['#2A9D8F', '#8AB17D', '#BABB74', '#E9C46A', '#E9AF64', '#E89A5E', '#E76F51'],
    group: ScaleType.Ordinal,
    name: 'colorScheme',
    selectable: false
  };

  constructor() {}

  ngOnInit(): void {
    this.changeSizeView(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: any): void {
    this.changeSizeView(event.target.innerWidth);
  }

  private changeSizeView(width: number): void {
    const IS_MOBILE = width <= 768;
    this.sizeView = IS_MOBILE ? [width / WIDTH_DIVISION_MOBILE, HEIGHT / WIDTH_DIVISION_MOBILE] : undefined;
  }
}
