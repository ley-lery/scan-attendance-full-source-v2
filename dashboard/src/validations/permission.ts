export const Permission = (formData: Permission, t: (key: string) => string) => {
  const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
        newErrors.name = t("validation.required");
    }
    if (!formData.description?.trim()) {
        newErrors.description = t("validation.required");
    }
  return newErrors;
};
