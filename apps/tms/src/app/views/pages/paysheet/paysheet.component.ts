import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './paysheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaysheetComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
}
