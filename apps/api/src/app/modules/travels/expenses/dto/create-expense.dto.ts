import { PartialType } from "@nestjs/mapped-types";
import { ExpenseDto } from "./expense.dto";

export class CreateExpenseDto extends PartialType(ExpenseDto) { }
