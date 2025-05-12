import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function addressValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const controls = (group as any).controls;

    const addressLine1 = controls.addressLine1.value?.trim();
    const addressLine2 = controls.addressLine2.value?.trim();
    const city = controls.city.value?.trim();
    const state = controls.state.value?.trim();
    const country = controls.country.value?.trim();
    const postalCode = controls.postalCode.value?.trim();

    const isAnyFieldFilled = !!(addressLine1 || addressLine2 || city || state || country || postalCode);
    const requiredFields = { addressLine1, city, state, country, postalCode };

    if (!isAnyFieldFilled) {
      // Clear all control-level errors when address is blank
      Object.keys(requiredFields).forEach(field => controls[field].setErrors(null));
      return null; // address is empty — valid
    }

    let hasError = false;

    // Apply errors to each required field individually
    Object.entries(requiredFields).forEach(([key, val]) => {
      if (!val) {
        controls[key].setErrors({ required: true });
        hasError = true;
      } else {
        controls[key].setErrors(null);
      }
    });

    return hasError ? { incompleteAddress: true } : null;
  };
}
