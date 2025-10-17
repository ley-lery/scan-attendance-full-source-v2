export const Student = (formData: Student, t: (key: string) => string) => {
  const newErrors: Record<string, string> = {};

  if (!formData.studentNameEn?.trim()) {
    newErrors.studentNameEn = t("validation.required");
  }

  if (!formData.studentNameKh?.trim()) {
    newErrors.studentNameKh = t("validation.required");
  }

  if (!formData.studentCode?.trim()) {
    newErrors.studentCode = t("validation.required");
  }

  if (!formData.dob) {
    newErrors.dob = t("validation.required");
  }

  if (!formData.gender?.trim()) {
    newErrors.gender = t("validation.required");
  }

  if (!formData.email?.trim()) {
    newErrors.email = t("validation.required");
  }

  if (!formData.phone?.trim()) {
    newErrors.phone = t("validation.required");
  }

  if (!formData.password?.trim()) {
    newErrors.password = t("validation.required");
  }

  return newErrors;
};
