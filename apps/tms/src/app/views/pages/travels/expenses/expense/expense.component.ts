import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'b404-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit {
  @Input() index: number = null;
  @Input() expensesForm: FormGroup;

  @Output() deleteExpenseGroup = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log(this.expensesForm);
  }

  deleteExpense() {
    this.deleteExpenseGroup.emit(this.index);
  }
}
