import { Component, OnInit } from '@angular/core';
import { OrderCardMode } from 'src/app/models';

@Component({
  templateUrl: './my-home.component.html',
  styleUrls: ['./my-home.component.scss']
})
export class MyHomeComponent implements OnInit {
  get CardModeEnum(): any {
    return OrderCardMode;
  }

  constructor() {}

  ngOnInit(): void {}
}
