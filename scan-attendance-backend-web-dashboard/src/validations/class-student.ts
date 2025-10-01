export const ClassStudent = (formData: ClassStudent, t: (key: string) => string) => {
    const newErrors: Record<string, string> = {};
  
    if (!formData.classId) {
      newErrors.classId = t("validation.required");
    }
  
    if (!formData.studentId) {
      newErrors.studentId = t("validation.required");
    }
  
    return newErrors;
};
  
  