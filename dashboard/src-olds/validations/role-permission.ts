export const RolePermission = (formData: RolePermission, t: (key: string) => string) => {
  const newErrors: Record<string, string> = {};

    if (!formData.role || formData.role === null) {
        newErrors.role = t("validation.required");
    }
    if (!formData.permission || formData.permission === null) {
        newErrors.permission = t("validation.required");
    }

  return newErrors;
};
