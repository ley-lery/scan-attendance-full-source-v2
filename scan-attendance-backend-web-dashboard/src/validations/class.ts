// export const Student = (formData: Student, t: (key: string) => string) => {
//   const newErrors: Record<string, string> = {};

//   if (!formData.name?.trim()) {
//     newErrors.name = t("validation.required");
//   }

//   if (formData.age == null || formData.age === 0) {
//     newErrors.age = t("validation.required");
//   }

//   if (!formData.dob) {
//     newErrors.dob = t("validation.required");
//   }

//   if (!formData.major?.trim()) {
//     newErrors.major = t("validation.required");
//   }

//   if (formData.gpa == null || formData.gpa === 0) {
//     newErrors.gpa = t("validation.required");
//   }

//   if (!formData.graduationYear?.trim()) {
//     newErrors.graduationYear = t("validation.required");
//   }

//   return newErrors;
// };

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

  if (!formData.programType) {
    newErrors.programType = t("validation.required");
  }

  return newErrors;
};
