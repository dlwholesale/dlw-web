import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Returns a validator function that validates a phone number.
 * You can optionally pass a default country code (e.g., 'US').
 */
export function phoneNumberValidator(defaultCountry: CountryCode = 'US'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const phoneNumber = parsePhoneNumberFromString(control.value, defaultCountry);
    if (phoneNumber?.isValid()) {
      return null;
    }

    return { invalidPhoneNumber: true };
  };
}
