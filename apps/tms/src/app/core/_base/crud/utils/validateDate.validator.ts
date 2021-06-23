import { AbstractControl } from '@angular/forms';

export class ConfirmDateValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static MatchDate(control: AbstractControl) {
    const dueDate = control.get('licensedueDate').value;
    console.log(dueDate);
    const today = new Date();
    console.log(today);

    if (dueDate < today) {
      console.log('No ma si son diferentes');
      control.get('licensedueDate').setErrors({ InvalidDate: true });
    } else {
      return null;
    }
  }
}
