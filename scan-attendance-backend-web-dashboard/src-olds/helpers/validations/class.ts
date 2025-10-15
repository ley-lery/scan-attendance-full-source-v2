export const Student = (formData: Student, t: (key: string) => string) => {
  const newErrors: Record<string, string> = {};

  if (!formData.studentNameEn?.trim()) {
    newErrors.studentNameEn = t("validation.required");
  }

  if (!formData.studentNameKh?.trim()) {
    newErrors.studentNameKh = t("validation.required");
  }

  if (!formData.dob) {
    newErrors.dob = t("validation.required");
  }
  return newErrors;
};

export const Class = (formData: Class, t: (key: string) => string) => {
  const newErrors: Record<string, string> = {};

  if (!formData.className?.trim()) {
    newErrors.className = t("validation.required");
  }

  if (!formData.roomName?.trim()) {
    newErrors.roomName = t("validation.required");
  }

  if (!formData.faculty) {
    newErrors.faculty = t("validation.required");
  }

  if (!formData.field) {
    newErrors.field = t("validation.required");
  }

  if (formData.promotionNo == null || formData.promotionNo <= 0) {
    newErrors.promotionNo = t("validation.required");
  }

  if (formData.termNo == null || formData.termNo <= 0) {
    newErrors.termNo = t("validation.required");
  }

  return newErrors;
};
