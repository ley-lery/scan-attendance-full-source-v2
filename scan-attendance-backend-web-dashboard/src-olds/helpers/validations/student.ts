export const Student = (formData: Student, t: (key: string) => string) => {
  const newErrors: Record<string, string> = {};

  if (!formData.name?.trim()) {
    newErrors.name = t("validation.required");
  }

  if (formData.age == null || formData.age === 0) {
    newErrors.age = t("validation.required");
  }

  if (!formData.dob) {
    newErrors.dob = t("validation.required");
  }

  if (!formData.major?.trim()) {
    newErrors.major = t("validation.required");
  }

  if (formData.gpa == null || formData.gpa === 0) {
    newErrors.gpa = t("validation.required");
  }

  if (!formData.graduationYear?.trim()) {
    newErrors.graduationYear = t("validation.required");
  }

  return newErrors;
};
