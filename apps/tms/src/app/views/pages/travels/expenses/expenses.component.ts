import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ExpenseModel } from '@tms/models';

@Component({
  selector: 'b404-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements OnInit {

  @Input() public expensesForm: FormGroup;
  @Input() private expenses: ExpenseModel[] = [];

  get expensesFormArray(): FormArray {
    return this.expensesForm.get('expenses') as FormArray;
  }

  constructor(
    private expensesFB: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.expenses?.map((e) => this.expensesFormArray.push(this.expenseRow(e)));
  }

  expenseRow(expense: ExpenseModel) {
    return this.expensesFB.group({
      name: [expense.name],
      price: [expense.price],
    });
  }

  prepareExpenses(): ExpenseModel[] {
    let expenses: ExpenseModel[] = [];

    for (let i = 0; i < this.expensesFormArray.length; i++) {
      const _expense = new ExpenseModel();
      _expense.name = this.expensesFormArray.at(i).get('name').value;
      _expense.price = this.expensesFormArray.at(i).get('price').value;
      expenses.push(_expense);
    }

    return expenses;
  }

  addExpense() {
    this.expensesFormArray.push(this.expenseRow({ name: '', price: null }));
  }

  deleteExpense(index: number) {
    this.expensesFormArray.removeAt(index);
  }
}
