export const UserRole = (formData: UserRole, t: (key: string) => string) => {
  const newErrors: Record<string, string> = {};

    if (!formData.user || formData.user === null) {
        newErrors.user = t("validation.required");
    }
    if (!formData.role || formData.role === null) {
        newErrors.role = t("validation.required");
    }

  return newErrors;
};
