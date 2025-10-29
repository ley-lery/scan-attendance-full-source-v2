export const Faculty = (formData: Faculty, t: (key: string) => string) => {
  const newErrors: Record<string, string> = {};

    if (!formData.facultyCode?.trim()) {
        newErrors.facultyCode = t("validation.required");
    }
    if (!formData.facultyNameKh?.trim()) {
        newErrors.facultyNameKh = t("validation.required");
    }
    if (!formData.facultyNameEn?.trim()) {
        newErrors.facultyNameEn = t("validation.required");
    }

  return newErrors;
};
