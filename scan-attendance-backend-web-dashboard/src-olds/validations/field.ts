export const Field = (formData: Field, t: (key: string) => string) => {
  const newErrors: Record<string, string> = {};

    if (!formData.fieldCode?.trim()) {
        newErrors.fieldCode = t("validation.required");
    }
    if (!formData.fieldCode?.trim()) {
        newErrors.fieldCode = t("validation.required");
    }
    if (!formData.fieldNameKh?.trim()) {
        newErrors.fieldNameKh = t("validation.required");
    }
    if (!formData.fieldNameEn?.trim()) {
        newErrors.fieldNameEn = t("validation.required");
    }

  return newErrors;
};
