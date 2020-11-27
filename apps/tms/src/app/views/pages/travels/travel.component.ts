import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './travel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
}
