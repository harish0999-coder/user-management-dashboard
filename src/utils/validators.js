const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the Add/Edit User form. Returns an object keyed by field name;
 * an empty object means the form is valid. Kept framework-agnostic and
 * side-effect free so it can be unit tested without rendering anything.
 */
export function validateUserForm(formData) {
  const errors = {};

  if (!formData.firstName?.trim()) {
    errors.firstName = "First name is required.";
  } else if (formData.firstName.trim().length > 50) {
    errors.firstName = "First name must be under 50 characters.";
  }

  if (!formData.lastName?.trim()) {
    errors.lastName = "Last name is required.";
  } else if (formData.lastName.trim().length > 50) {
    errors.lastName = "Last name must be under 50 characters.";
  }

  if (!formData.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(formData.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!formData.department?.trim()) {
    errors.department = "Department is required.";
  }

  return errors;
}

export function isFormValid(errors) {
  return Object.keys(errors).length === 0;
}
