export const UserPermission = (formData: UserPermission, t: (key: string) => string) => {
  const newErrors: Record<string, string> = {};

    if (!formData.user || formData.user === null) {
        newErrors.user = t("validation.required");
    }
    if (!formData.permission || formData.permission === null) {
        newErrors.permission = t("validation.required");
    }

  return newErrors;
};
