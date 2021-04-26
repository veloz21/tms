import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { TireModel } from '@tms/models';

@Component({
  selector: 'b404-tires-shared-edit',
  templateUrl: './tires-shared-edit.component.html',
  styleUrls: ['./tires-shared-edit.component.scss']
})
export class TiresSharedEditComponent implements OnInit {

  @Input() public tiresFormArray: FormArray;
  @Input() public tires: TireModel[] = [];

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.tires?.map((e) => this.tiresFormArray.push(this.tireRow(e)));
  }

  tireRow(tire: TireModel) {
    return this.fb.group({
      id: [tire.id],
      serialNumber: [tire.serialNumber, [Validators.required]],
      rangeTraveled: [tire.rangeTraveled, [Validators.required]],
    });
  }

  prepareTires(): TireModel[] {
    let tires: TireModel[] = [];

    for (let i = 0; i < this.tiresFormArray.length; i++) {
      const _tire = new TireModel();
      _tire.id = this.tiresFormArray.at(i).get('id').value;
      _tire.serialNumber = this.tiresFormArray.at(i).get('serialNumber').value;
      _tire.rangeTraveled = this.tiresFormArray.at(i).get('rangeTraveled').value;
      tires.push(_tire);
    }

    return tires;
  }

  addTire() {
    this.tiresFormArray.push(this.tireRow(new TireModel()));
  }

  deleteTire(index: number) {
    this.tiresFormArray.removeAt(index);
  }

  drop(event: CdkDragDrop<unknown>) {
    this.moveItemInFormArray(this.tiresFormArray, event.previousIndex, event.currentIndex);
  }

  /**
  * Moves an item in a FormArray to another position.
  * @param formArray FormArray instance in which to move the item.
  * @param fromIndex Starting index of the item.
  * @param toIndex Index to which he item should be moved.
  */
  moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) {
      return;
    }

    const previous = formArray.at(fromIndex);
    const current = formArray.at(toIndex);
    formArray.setControl(toIndex, previous);
    formArray.setControl(fromIndex, current);
  }

}
