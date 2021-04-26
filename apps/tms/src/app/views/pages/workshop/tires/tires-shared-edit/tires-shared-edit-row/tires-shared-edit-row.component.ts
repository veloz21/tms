import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'b404-tires-shared-edit-row',
  templateUrl: './tires-shared-edit-row.component.html',
  styleUrls: ['./tires-shared-edit-row.component.scss']
})
export class TiresSharedEditRowComponent implements OnInit {

  @Input() index: number = null;
  @Input() tireForm: FormGroup;

  @Output() deleteTireGroup = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  deleteTire() {
    this.deleteTireGroup.emit(this.index);
  }

}
