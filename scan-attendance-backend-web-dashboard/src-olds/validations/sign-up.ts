

export const SignUp = (formData: SignUpData, t: (key: string) => string) => {
  const newErrors: Record<string, string> = {};

    if (!formData.username?.trim()) {
        newErrors.username = t("validation.required");
    }
    if (!formData.email?.trim()) {
        newErrors.email = t("validation.required");
    }
    if (!formData.password?.trim()) {
        newErrors.password = t("validation.required");
    }
    if (!formData.assignType?.trim()) {
        newErrors.assignType = t("validation.required");
    }
    if (!formData.assignTo) {
        newErrors.assignTo = t("validation.required");
    }

  return newErrors;
};
