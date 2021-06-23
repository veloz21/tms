import { AbstractControl } from '@angular/forms';

export class ConfirmDateValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static MatchDate(control: AbstractControl) {
    const dueDate = control.get('licensedueDate').value;
    const today = new Date();
    if (dueDate < today) {
      control.get('licensedueDate').setErrors({ InvalidDate: true });
    } else {
      return null;
    }
  }
}
