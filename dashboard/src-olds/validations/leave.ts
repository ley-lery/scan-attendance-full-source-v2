export const StudentLeave = (
  formData: StudentLeave,
  t: (key: string) => string,
) => {
  const newErrors: Record<string, string> = {};

  if (!formData.student) {
    newErrors.student = t("validation.required");
  }
  if (!formData.requestDate) {
    newErrors.requestDate = t("validation.required");
  }
  if (!formData.approvedDate) {
    newErrors.approvedDate = t("validation.required");
  }
  if (!formData.startDate) {
    newErrors.startDate = t("validation.required");
  }
  if (!formData.endDate) {
    newErrors.endDate = t("validation.required");
  }
  if (!formData.reason?.trim()) {
    newErrors.reason = t("validation.required");
  }
  if (!formData.approvedByUser) {
    newErrors.approvedByUser = t("validation.required");
  }
  if (!formData.approvedByLecturer) {
    newErrors.approvedByLecturer = t("validation.required");
  }

  return newErrors;
};
export const LecturerLeave = (
  formData: LecturerLeave,
  t: (key: string) => string,
) => {
  const newErrors: Record<string, string> = {};

  if (!formData.student) {
    newErrors.student = t("validation.required");
  }
  if (!formData.requestDate) {
    newErrors.requestDate = t("validation.required");
  }
  if (!formData.startDate) {
    newErrors.startDate = t("validation.required");
  }
  if (!formData.endDate) {
    newErrors.endDate = t("validation.required");
  }
  if (!formData.reason?.trim()) {
    newErrors.reason = t("validation.required");
  }
  if (!formData.approvedByUser) {
    newErrors.approvedByUser = t("validation.required");
  }
  if (!formData.approvedByLecturer) {
    newErrors.approvedByLecturer = t("validation.required");
  }

  return newErrors;
};
