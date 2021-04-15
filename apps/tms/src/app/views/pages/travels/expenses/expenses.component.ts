import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ExpenseModel } from '@tms/models';

@Component({
  selector: 'b404-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements OnInit {
  expensesArray: FormArray;
  @Input() expenses: ExpenseModel[] = [];
  @Input() expensesForm: FormGroup;

  get expensesFormArray(): FormArray {
    return (this.expensesArray = this.expensesForm.get('expenses') as FormArray);
  }

  constructor(private expensesFB: FormBuilder) {}

  ngOnInit() {
    this.createForm();
    console.log(this.expensesFormArray);
  }

  createForm() {
    this.expenses.map((e) => this.expensesFormArray.push(this.expenseRow(e)));
  }

  expenseRow(expense: ExpenseModel) {
    return this.expensesFB.group({
      name: [expense.name],
      price: [expense.price],
    });
  }

  prepareExpenses() {
    let expenses: any[] = [];

    for (let i = 0; i < this.expensesFormArray.length; i++) {
      const _expnses = new ExpenseModel();
      _expnses.name = this.expensesFormArray.at(i).get('name').value;
      _expnses.price = this.expensesFormArray.at(i).get('price').value;
      expenses.push(_expnses);
    }

    return expenses;
  }

  addExpense() {
    this.expensesFormArray.push(this.expenseRow({ name: '', price: null }));
    console.log(this.expensesFormArray);
  }

  deleteExpense(index) {
    this.expensesFormArray.removeAt(index);
  }
}
