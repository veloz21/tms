import { AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
export class ExtendedFormControl extends FormControl {
  statusChanges$: Subscription;
  touchedChanges: Subject<boolean> = new Subject<boolean>();
  constructor(
    formState?: any,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(formState, validatorOrOpts, asyncValidator);
  }
  markAsTouched({ onlySelf }: { onlySelf?: boolean } = {}): void {
    super.markAsTouched({ onlySelf });
    this.touchedChanges.next(true);
  }
}
