export const Program = (formData: Program, t: (key: string) => string) => {
  const newErrors: Record<string, string> = {};

    if (!formData.type) {
        newErrors.type = t("validation.required");
    }
    if (!formData.faculty) {
        newErrors.faculty = t("validation.required");
    }
    if (!formData.field) {
        newErrors.field = t("validation.required");
    }
    if (!formData.course) {
        newErrors.course = t("validation.required");
    }

  return newErrors;
};
