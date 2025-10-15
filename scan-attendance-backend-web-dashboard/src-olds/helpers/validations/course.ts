export const Course = (formData: Course, t: (key: string) => string) => {
  const newErrors: Record<string, string> = {};

    if (!formData.courseCode?.trim()) {
        newErrors.courseCode = t("validation.required");
    }
    if (!formData.courseNameKh?.trim()) {
        newErrors.courseNameKh = t("validation.required");
    }
    if (!formData.courseNameEn?.trim()) {
        newErrors.courseNameEn = t("validation.required");
    }

  return newErrors;
};
