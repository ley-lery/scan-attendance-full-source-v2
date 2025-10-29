export const Lecturer = (formData: Lecturer, t: (key: string) => string) => {
  const newErrors: Record<string, string> = {};
  if (!formData.lecturerCode?.trim()) {
    newErrors.lecturerCode = t("validation.required");
  }
  if (!formData.lecturerNameKh?.trim()) {
    newErrors.lecturerNameKh = t("validation.required");
  }
  if (!formData.lecturerNameEn?.trim()) {
    newErrors.lecturerNameEn = t("validation.required");
  }
  if (!formData.dob) {
    newErrors.dob = t("validation.required");
  }
  if (!formData.email?.trim()) {
    newErrors.email = t("validation.required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = t("validation.invalidEmail");
  }
  if (!formData.phone?.trim()) {
    newErrors.phone = t("validation.required");
  } else if (!/^\d{9,15}$/.test(formData.phone)) {
    newErrors.phone = t("validation.invalidPhone");
  }
  if (!formData.gender) {
    newErrors.gender = t("validation.required");
  }
  if (!formData.status) {
    newErrors.status = t("validation.required");
  }

  return newErrors;
};
export const LecturerCourse = (
  formData: LecturerCourse,
  t: (key: string) => string,
) => {
  const newErrors: Record<string, string> = {};
  if (!formData.lecturer) {
    newErrors.lecturer = t("validation.required");
  }
  if (!formData.course) {
    newErrors.course = t("validation.required");
  }
  return newErrors;
};
