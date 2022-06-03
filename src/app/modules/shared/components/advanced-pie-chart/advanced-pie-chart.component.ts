import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { ChartData } from 'src/app/models';

const HEIGHT = 400;
const DIVISION_MOBILE = 1.2;
const DIVISION_DESKTOP = 2;

@Component({
  selector: 'app-advanced-pie-chart',
  templateUrl: './advanced-pie-chart.component.html',
  styleUrls: ['./advanced-pie-chart.component.scss']
})
export class AdvancedPieChartComponent implements OnInit {
  @Input() public data: Array<ChartData>;
  @Input() public label: string;

  public sizeView: [number, number];
  public gradient: boolean = true;
  public showLegend: boolean = true;
  public showLabels: boolean = true;
  public isDoughnut: boolean = false;

  public colorScheme: Color = {
    domain: ['#2a9d8f', '#e9c46a', '#e76f51'],
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
    // this.sizeView = [width / (IS_MOBILE ? WIDTH_DIVISION_MOBILE : WIDTH_DIVISION_DESKTOP), HEIGHT];
    this.sizeView = IS_MOBILE
      ? [width / DIVISION_MOBILE, HEIGHT / (DIVISION_MOBILE * 1.6)]
      : [width / DIVISION_DESKTOP, HEIGHT / DIVISION_DESKTOP];
  }
}
