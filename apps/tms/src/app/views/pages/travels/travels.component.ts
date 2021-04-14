import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './travels.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelsComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
}
