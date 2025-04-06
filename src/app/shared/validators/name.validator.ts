import { AbstractControl, ValidatorFn } from '@angular/forms';

export function nameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value ? control.value.trim() : '';

    const valid = /^[A-Za-z ]+$/.test(value);

    return valid ? null : { invalidName: true };
  };
}
