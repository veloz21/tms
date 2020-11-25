import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './workshop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkshopComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
}
