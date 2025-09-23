import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Tab, Tabs, Form, Select, SelectItem, Spinner } from "@heroui/react";
import { IoMailOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import UniLogo from "@/assets/logo/bbu-logo.png";
import { PiChalkboardTeacherLight, PiStudentLight } from "react-icons/pi";
import { AiOutlineUser } from "react-icons/ai";
import { CiCreditCard1 } from "react-icons/ci";
import { Eye, EyeOff, Facebook, Mail, Phone, UserPlus } from "lucide-react";

// Services
// import branchService from "@/services/branch.service";
import StudentService from "@/services/student.service";
import lecturerService from "@/services/lecturer.service";

// Components
import AutocompleteUi from "@/components/hero-ui/auto-complete/AutocompleteUi";
import SelectMultipleUi from "@/components/hero-ui/select/MultipleSelect";
import ShowToast from "@/components/hero-ui/toast/ShowToast";
import ThemeSwitcher from "@/components/ui/theme/ThemeSwitch";
import SwitchTranslate from "@/components/ui/switch/SwitchTranslate";

// Types
interface Branch {
  id: string;
  shortName: string;
  branch_name_en: string;
  branch_name_kh: string;
}

interface LecturerFormData {
  lecturerId?: string | null;
  username: string;
  email: string;
  password: string;
  role: string;
  branch: Branch[];
}

interface StudentFormData {
  username: string;
  studentId: string;
  password: string;
  role: string;
  branch: string | null;
}

type FormType = "lecturer" | "student";

interface BackgroundOption {
  key: string;
  label: string;
}

interface ContactLink {
  icon: React.ComponentType<{ size: number; className: string }>;
  href: string;
  label: string;
  text: string;
}

interface CustomInputProps {
  label: string;
  name: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  endContent?: React.ReactNode;
  isRequired?: boolean;
}

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  studentId?: string;
  branch?: string;
}

// Constants
const BACKGROUND_OPTIONS: BackgroundOption[] = [
  { key: 'bg-auth', label: 'Default' },
  { key: 'cotton-candy-sky', label: 'Cotton Candy Sky' },
  { key: 'warm-light-apricot-coral', label: 'Warm Light Apricot & Coral' },
  { key: 'orange-soft-glow', label: 'Orange Soft Glow' },
  { key: 'soft-pink-glow', label: 'Soft Pink Glow' },
  { key: 'volcanic-ember', label: 'Volcanic Ember' },
  { key: 'cosmic-Noise', label: 'Cosmic Noise' },
  { key: 'violet-abyss', label: 'Violet Abyss' },
];

const CONTACT_LINKS: ContactLink[] = [
  {
    icon: Facebook,
    href: "#",
    label: "Facebook",
    text: "bbu@official"
  },
  {
    icon: Mail,
    href: "mailto:bbu@edu.kh.com",
    label: "Email",
    text: "bbu@edu.kh.com"
  },
  {
    icon: Phone,
    href: "tel:+85512345678",
    label: "Phone",
    text: "+855 12 345 678"
  }
];

const INITIAL_LECTURER_DATA: LecturerFormData = {
  lecturerId: null,
  username: "",
  email: "",
  password: "",
  role: "lecturer",
  branch: [],
};

const INITIAL_STUDENT_DATA: StudentFormData = {
  username: "",
  studentId: '',
  password: "",
  role: "student",
  branch: null,
};

const PASSWORD_MIN_LENGTH = 8;
const USERNAME_MIN_LENGTH = 3;

// Utility Functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= PASSWORD_MIN_LENGTH;
};

const validateUsername = (username: string): boolean => {
  return username.length >= USERNAME_MIN_LENGTH && /^[a-zA-Z0-9_]+$/.test(username);
};

// Components
const CustomInput: React.FC<CustomInputProps> = ({
  label,
  name,
  placeholder,
  type,
  value,
  onChange,
  endContent,
  isRequired = false
}) => (
  <Input
    isRequired={isRequired}
    label={label}
    name={name}
    placeholder={placeholder}
    type={type}
    variant="bordered"
    value={value}
    onChange={onChange}
    endContent={endContent}
    color="primary"
    classNames={{
      inputWrapper: "border-zinc-300 dark:border-zinc-600",
      label: "dark:text-zinc-300 text-zinc-600",
    }}
  />
);

const ContactInfo: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-80 text-base">
      <p className="mb-2 text-zinc-500 dark:text-zinc-400">
        {t("registrationHelp") || "Need help with registration? Contact us:"}
      </p>
      <ul className="gap-2 flex flex-col *:items-center *:gap-2 *:flex">
        {CONTACT_LINKS.map((contact) => (
          <li key={contact.label}>
            <contact.icon size={16} className="text-blue-400" />
            <a 
              href={contact.href} 
              className="text-blue-400 hover:underline text-sm"
              aria-label={`Contact via ${contact.label}`}
            >
              {contact.label}: {contact.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const WelcomeSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-4 pr-4 max-w-80 justify-between"
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium text-zinc-700 dark:text-white">
          {t("createAccount") || "Create Your Account"}
        </h2>
        <p className="text-base text-zinc-500 dark:text-zinc-400">
          {t("registrationDescription") || "To get started with the management system, please enter your email, password, and other required information."}
        </p>
        <p className="text-base text-zinc-500 dark:text-zinc-400">
          {t("haveAccountMessage") || "Already have an account? Please contact the admin or proceed to the login page."}
        </p>
      </div>
      <ContactInfo />
    </motion.div>
  );
};

const TopBar: React.FC<{selectedBackground: string; onBackgroundChange: (bg: string) => void}> = ({ onBackgroundChange }) => (
  <div className="absolute top-0 right-0 z-50 flex items-center justify-between w-full p-2 gap-2">
    <Select 
      className="max-w-52" 
      variant="underlined" 
      color="primary" 
      defaultSelectedKeys={[BACKGROUND_OPTIONS[0].key]}
      aria-label="Background theme selector"
    >
      {BACKGROUND_OPTIONS.map((bg) => (
        <SelectItem 
          key={bg.key} 
          onClick={() => onBackgroundChange(bg.key)}
        >
          {bg.label}
        </SelectItem>
      ))}
    </Select>
    <div className="flex items-center gap-2">
      <SwitchTranslate />
      <ThemeSwitcher />
    </div>
  </div>
);

const Register: React.FC = () => {
  const { t } = useTranslation();

  // State
  const [selectedBackground, setSelectedBackground] = useState<string>("bg-auth");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [formSelected, setFormSelected] = useState<FormType>("lecturer");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  const [lecturerFormData, setLecturerFormData] = useState<LecturerFormData>(INITIAL_LECTURER_DATA);
  const [studentData, setStudentData] = useState<StudentFormData>(INITIAL_STUDENT_DATA);

  // Effects
  useEffect(() => {
    loadBranches();
  }, []);

  // Handlers
  const loadBranches = async () => {
    try {
      // const response = await branchService.getAll();
      const fixBranches: Branch[] = [
        { id: "1", shortName: "Branch 1", branch_name_en: "Branch 1", branch_name_kh: "Branch 1" },
        { id: "2", shortName: "Branch 2", branch_name_en: "Branch 2", branch_name_kh: "Branch 2" },
        { id: "3", shortName: "Branch 3", branch_name_en: "Branch 3", branch_name_kh: "Branch 3" },
      ];
      setBranches(fixBranches);
    } catch (error) {
      console.error("Failed to fetch branch data", error);
      showToast("danger", "Error", "Failed to load branches. Please refresh the page.");
    }
  };

  const showToast = (color: "success" | "danger" | "warning", title: string, description: string) => {
    ShowToast({ color, title, description });
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (formSelected === "lecturer") {
      if (!validateUsername(lecturerFormData.username)) {
        errors.username = "Username must be at least 3 characters and contain only letters, numbers, and underscores";
      }
      if (!validateEmail(lecturerFormData.email)) {
        errors.email = "Please enter a valid email address";
      }
      if (!validatePassword(lecturerFormData.password)) {
        errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
      }
      if (!lecturerFormData.branch || lecturerFormData.branch.length === 0) {
        errors.branch = "Please select at least one branch";
      }
    } else if (formSelected === "student") {
      if (!validateUsername(studentData.username)) {
        errors.username = "Username must be at least 3 characters and contain only letters, numbers, and underscores";
      }
      if (!studentData.studentId.trim()) {
        errors.studentId = "Student ID is required";
      }
      if (!validatePassword(studentData.password)) {
        errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
      }
      if (!studentData.branch) {
        errors.branch = "Please select a branch";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkLecturerEmail = async (lecturerEmail: string): Promise<boolean> => {
    try {
      const response = await lecturerService.checkLecturerEmail(lecturerEmail);
      if (response.data?.length > 0) {
        const foundId = response.data[0].lecturerId || null;
        setLecturerFormData(prev => ({
          ...prev,
          lecturerId: foundId
        }));
        showToast("success", "Lecturer Found", "Lecturer found! You can proceed with registration.");
        return true;
      } else {
        showToast("warning", "Lecturer Not Found", "Lecturer not found! Please check the email.");
        setLecturerFormData(prev => ({
          ...prev,
          lecturerId: null,
        }));
        return false;
      }
    } catch (error) {
      console.error("Failed to fetch lecturer data", error);
      showToast("danger", "Error", "Failed to verify lecturer email. Please try again.");
      setLecturerFormData(prev => ({
        ...prev,
        lecturerId: null,
      }));
      return false;
    }
  };

  const checkStudentBranch = async (branch: string, studentId: string): Promise<boolean> => {
    try {
      const response = await StudentService.getStudentBranch(branch, studentId);
      if ((response.data || []).length === 0) {
        showToast("success", "Available", "Student ID is available for registration.");
        return true;
      } else {
        showToast("warning", "Already Registered", "Student already exists in this branch.");
        return false;
      }
    } catch (error) {
      console.error("Failed to check student branch", error);
      showToast("warning", "Verification Failed", "Could not verify student information. Please try again.");
      return false;
    }
  };

  const handleBackgroundChange = (bg: string) => {
    setSelectedBackground(bg);
  };

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handleLecturerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLecturerFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBranchSelection = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string | null } }) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value || '' }));
    
    // Clear validation error for branch
    if (validationErrors.branch) {
      setValidationErrors(prev => ({ ...prev, branch: undefined }));
    }
  };

  const handleBranchMultipleSelection = (selectedBranches: Branch[]) => {
    setLecturerFormData(prev => ({
      ...prev,
      branch: selectedBranches,
    }));
    
    // Clear validation error for branch
    if (validationErrors.branch) {
      setValidationErrors(prev => ({ ...prev, branch: undefined }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast("danger", "Validation Error", "Please fix the errors in the form.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (formSelected === "lecturer") {
        const emailVerified = await checkLecturerEmail(lecturerFormData.email.trim().toLowerCase());
        if (emailVerified) {
          const formData = {
            ...lecturerFormData,
            email: lecturerFormData.email.trim().toLowerCase(),
            branch: lecturerFormData.branch.map(b => b.shortName),
          };
          console.log("Lecturer Form Data:", formData);
          // Here you would typically submit the form to your API
          showToast("success", "Registration Started", "Lecturer registration process initiated.");
        }
      } else if (formSelected === "student") {
        const studentVerified = await checkStudentBranch(
          studentData.branch || "", 
          studentData.studentId.trim().toUpperCase()
        );
        if (studentVerified) {
          const formData = {
            ...studentData,
            studentId: studentData.studentId.trim().toUpperCase(),
          };
          console.log("Student Form Data:", formData);
          // Here you would typically submit the form to your API
          showToast("success", "Registration Started", "Student registration process initiated.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      showToast("danger", "Registration Error", "An error occurred during registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPasswordToggle = () => (
    <button 
      type="button" 
      onClick={togglePasswordVisibility} 
      aria-label="Toggle password visibility"
      className="focus:outline-none"
    >
      {isPasswordVisible ? (
        <Eye size={17} className="text-zinc-500 dark:text-zinc-300" />
      ) : (
        <EyeOff size={17} className="text-zinc-500 dark:text-zinc-300" />
      )}
    </button>
  );

  const renderValidationError = (field: keyof ValidationErrors) => {
    if (validationErrors[field]) {
      return (
        <p className="text-red-500 text-xs mt-1">{validationErrors[field]}</p>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#fefcff] dark:bg-[#1e1e1e] bg-cover">
      <TopBar 
        selectedBackground={selectedBackground}
        onBackgroundChange={handleBackgroundChange}
      />
      
      <div className={`absolute inset-0 z-0 ${selectedBackground}`} />
      
      <div className="relative grid grid-cols-1 lg:grid-cols-2 place-content-center gap-4 p-4">
        <WelcomeSection />
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center"
        >
          <div className="p-6 dark:bg-zinc-800/50 bg-white/50 backdrop-blur-sm rounded-2xl min-h-[550px] shadow-lg shadow-zinc-200/30 dark:shadow-black/10 max-w-md w-full">
            <div className="flex items-start justify-between mb-4 gap-10">
              <div>
                <h1 className="text-lg font-semibold text-zinc-700 dark:text-white">
                  {t("createUniversityAccount") || "Create Your University Account"}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-60">
                  {t("registerSubtitle") || "Access your personalized dashboard and manage your academic profile."}
                </p>
              </div>
              <div>
                <img
                  src={UniLogo}
                  alt="University Logo"
                  className="w-14 opacity-80"
                />
              </div>
            </div>

            <Form
              onSubmit={onSubmit}
              validationBehavior="native"
              className="relative flex flex-col w-full"
            >
              <Tabs
                aria-label="Registration type selection"
                color="default"
                radius="lg"
                fullWidth
                size="lg"
                className="mt-2"
                selectedKey={formSelected}
                onSelectionChange={(key) => {
                  if (key === "student" || key === "lecturer") {
                    setFormSelected(key);
                    setValidationErrors({});
                  }
                }}
                classNames={{
                  tabList: "bg-black/5 dark:bg-white/5",
                  tab: "border-none shadow-none",
                }}
              >
                {/* Lecturer Form */}
                <Tab
                  key="lecturer"
                  title={
                    <div className="flex items-center gap-2">
                      <PiChalkboardTeacherLight size={22} />
                      <h2>{t('lecturer')}</h2>
                    </div>
                  }
                  className="w-full"
                >
                  <div className="space-y-3">
                    <div>
                      <CustomInput
                        isRequired
                        label={t("username")}
                        name="username"
                        placeholder={t("enterUsername")}
                        type="text"
                        value={lecturerFormData.username}
                        onChange={handleLecturerChange}
                        endContent={<AiOutlineUser className="text-zinc-500" />}
                      />
                      {renderValidationError('username')}
                    </div>

                    <div>
                      <CustomInput
                        isRequired
                        label={t("email")}
                        name="email"
                        placeholder={t("enterEmail")}
                        type="email"
                        value={lecturerFormData.email}
                        onChange={handleLecturerChange}
                        endContent={<IoMailOutline className="text-zinc-500" />}
                      />
                      {renderValidationError('email')}
                    </div>

                    <div>
                      <CustomInput
                        isRequired
                        label={t("password")}
                        name="password"
                        placeholder={t("enterPassword")}
                        type={isPasswordVisible ? "text" : "password"}
                        value={lecturerFormData.password}
                        onChange={handleLecturerChange}
                        endContent={renderPasswordToggle()}
                      />
                      {renderValidationError('password')}
                    </div>

                    <div>
                      <SelectMultipleUi
                        items={branches}
                        selectedItems={lecturerFormData.branch}
                        onChange={handleBranchMultipleSelection}
                        label={t("assignedBranches") || "Assigned Branches"}
                        placeholder={t("selectBranches") || "Select branches"}
                        isRequired
                      />
                      {renderValidationError('branch')}
                    </div>
                  </div>
                </Tab>

                {/* Student Form */}
                <Tab
                  key="student"
                  title={
                    <div className="flex items-center gap-2">
                      <PiStudentLight size={22} />
                      <h2>{t('student')}</h2>
                    </div>
                  }
                  className="w-full"
                >
                  <div className="space-y-3">
                    <div>
                      <CustomInput
                        isRequired
                        label={t("username")}
                        name="username"
                        placeholder={t("enterUsername")}
                        type="text"
                        value={studentData.username}
                        onChange={handleStudentChange}
                        endContent={<AiOutlineUser className="text-zinc-500" />}
                      />
                      {renderValidationError('username')}
                    </div>

                    <div>
                      <CustomInput
                        isRequired
                        label={t("studentId")}
                        name="studentId"
                        placeholder={t("enterStudentId")}
                        type="text"
                        value={studentData.studentId}
                        onChange={handleStudentChange}
                        endContent={<CiCreditCard1 className="text-zinc-400" size={20} />}
                      />
                      {renderValidationError('studentId')}
                    </div>

                    <div>
                      <CustomInput
                        isRequired
                        label={t("password")}
                        name="password"
                        placeholder={t("enterPassword")}
                        type={isPasswordVisible ? "text" : "password"}
                        value={studentData.password}
                        onChange={handleStudentChange}
                        endContent={renderPasswordToggle()}
                      />
                      {renderValidationError('password')}
                    </div>

                    <div>
                      <AutocompleteUi
                        label={t("branch")}
                        placeholder={t("chooseBranch")}
                        name="branch"
                        selectedKey={studentData.branch}
                        onSelectionChange={handleBranchSelection}
                        options={branches}
                        optionLabel="branch_name_en"
                        optionSubLabel="branch_name_kh"
                        optionValue="shortName"
                        variant="bordered"
                        isRequired
                        labelPlacement="inside"
                        classNames={{
                          base: "py-[.9px]"
                        }}
                      />
                      {renderValidationError('branch')}
                    </div>
                  </div>
                </Tab>
              </Tabs>

              <Button 
                color="primary" 
                className="w-full" 
                type="submit"
                isDisabled={isSubmitting}
                startContent={
                  isSubmitting ? (
                    <Spinner variant="spinner" size="sm" color="white" />
                  ) : (
                    <UserPlus size={17} />
                  )
                }
              >
                {isSubmitting ? t("registering") || "Registering..." : t("register")}
              </Button>
            </Form>

            <div className="mt-4 flex items-center justify-center gap-2">
              <p className="dark:text-zinc-200 text-zinc-600">
                {t("haveAccount") || "Have an account?"}
              </p>
              <Link to="/login" className="text-blue-500 hover:underline">
                {t("login")}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;