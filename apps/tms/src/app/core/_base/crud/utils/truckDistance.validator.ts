import { AbstractControl } from '@angular/forms';

export class CheckDistanceValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static CheckDistance(control: AbstractControl) {
    const initaialRange = control.get('initialRange').value;

    const rangeTraveled = control.get('rangeTraveled').value;

    if (rangeTraveled < initaialRange) {
      control.get('rangeTraveled').setErrors({ TruckDistance: true });
    } else {
      return null;
    }
  }
}
