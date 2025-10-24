import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Tab, Tabs, Form, Select, SelectItem, Spinner } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import UniLogo from "@/assets/logo/bbu-logo.png";
import { PiChalkboardTeacherLight, PiStudentLight } from "react-icons/pi";
import { Eye, EyeOff, Facebook, Mail, Phone, UserPlus } from "lucide-react";

// Services
import ShowToast from "@/components/hero-ui/toast/ShowToast";
import ThemeSwitcher from "@/components/ui/theme/ThemeSwitch";
import SwitchTranslate from "@/components/ui/switch/SwitchTranslate";
import { useMutation } from "@/hooks/useMutation";
import { Validation } from "@/validations";
import Particles from "@/components/ui/configs/Particles";

// Types
type FormType = "Lecturer" | "Student";

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
  isInvalid?: boolean;
  errorMessage?: string;
}

interface SignUpData {
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  assignType: FormType;
  assignTo: number;
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

const INITIAL_FORM_DATA: SignUpData = {
  username: "",
  email: "",
  password: "",
  isActive: true,
  assignType: "Lecturer",
  assignTo: 2244
};

const FORM_FIELDS = ["username", "email", "password"] as const;

// Components
const CustomInput: React.FC<CustomInputProps> = ({
  label,
  name,
  placeholder,
  type,
  value,
  onChange,
  endContent,
  isRequired = false,
  isInvalid = false,
  errorMessage = ""
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
    isInvalid={isInvalid}
    errorMessage={errorMessage}
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

const TopBar: React.FC<{
  selectedBackground: string;
  onBackgroundChange: (bg: string) => void;
}> = ({ selectedBackground, onBackgroundChange }) => (
  <div className="absolute top-0 right-0 z-50 flex items-center justify-between w-full p-2 gap-2">
    <Select 
      className="max-w-52" 
      variant="underlined" 
      color="primary" 
      selectedKeys={[selectedBackground]}
      onSelectionChange={(keys) => {
        const key = Array.from(keys)[0] as string;
        if (key) onBackgroundChange(key);
      }}
      aria-label="Background theme selector"
    >
      {BACKGROUND_OPTIONS.map((bg) => (
        <SelectItem key={bg.key}>
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
  const [formSelected, setFormSelected] = useState<FormType>("Lecturer");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<SignUpData>(INITIAL_FORM_DATA);

  const { mutate: signUp, loading: signUpLoading } = useMutation();

  // Handlers
  const handleBackgroundChange = useCallback((bg: string) => {
    setSelectedBackground(bg);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prev => !prev);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    setErrors(prev => {
      if (prev[name as keyof ValidationErrors]) {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ValidationErrors];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleTabChange = useCallback((key: React.Key) => {
    if (key === "Student" || key === "Lecturer") {
      setFormSelected(key);

      // Reset form and errors when switching tabs
      setFormData(() => ({ ...INITIAL_FORM_DATA, assignType: key }));
      setErrors({});
    }
  }, []);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = Validation.SignUp(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload: SignUpData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      assignType: formSelected,
      isActive: true,
      assignTo: formSelected === "Lecturer" ? 2244 : 123,
    };
    
    try {
      await signUp('/auth/user/signup', payload, 'POST');
      ShowToast({ 
        color: "success", 
        title: t("registrationSuccess") || "Registration Success", 
        description: t("registrationSuccessMessage") || "Your account has been created successfully." 
      });
      // Reset form after successful submission
      setFormData(INITIAL_FORM_DATA);
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error?.response?.data?.message || 
                          t("registrationError") || 
                          "An error occurred during registration. Please try again.";
      ShowToast({ 
        color: "danger", 
        title: t("registrationErrorTitle") || "Registration Error", 
        description: errorMessage 
      });
    }
  }, [formData, formSelected, signUp, t]);

  const renderPasswordToggle = useMemo(() => (
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
  ), [isPasswordVisible, togglePasswordVisibility]);

  const renderFormFields = useMemo(() => (
    <div className="space-y-3">
      {FORM_FIELDS.map((field) => (
        <CustomInput
          key={field}
          isRequired
          label={t(field) || field}
          name={field}
          placeholder={t(`enter${field.charAt(0).toUpperCase() + field.slice(1)}`) || `Enter ${field}`}
          type={field === "password" ? (isPasswordVisible ? "text" : "password") : field === "email" ? "email" : "text"}
          value={formData[field]}
          onChange={handleChange}
          endContent={field === "password" ? renderPasswordToggle : undefined}
          isInvalid={!!errors[field as keyof ValidationErrors]}
          errorMessage={errors[field as keyof ValidationErrors]}
        />
      ))}
    </div>
  ), [formData, errors, isPasswordVisible, handleChange, renderPasswordToggle, t]);

  return (
    <div className="flex min-h-screen justify-center bg-[#fefcff] dark:bg-[#1e1e1e] bg-cover">
      {/* <TopBar 
        selectedBackground={selectedBackground}
        onBackgroundChange={handleBackgroundChange}
      /> */}
      
      {/* <div className={`absolute inset-0 z-0 ${selectedBackground}`} /> */}
      <Particles/>
      
      <div className="relative grid grid-cols-1 lg:grid-cols-2 place-content-center gap-4 p-4">
        <WelcomeSection />
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center"
        >
          <div className="p-6 dark:bg-zinc-800/50 bg-white/50 backdrop-blur-sm rounded-3xl  shadow-lg shadow-zinc-200/30 dark:shadow-black/10 max-w-96">
            <div className="flex items-start justify-between mb-4 gap-10">
              <div>
                <h1 className="text-lg leading-5 font-semibold text-zinc-700 dark:text-white">
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
                onSelectionChange={handleTabChange}
                classNames={{
                  tabList: "bg-black/5 dark:bg-white/5",
                  tab: "border-none shadow-none",
                }}
              >
                <Tab
                  key="Lecturer"
                  title={
                    <div className="flex items-center gap-2">
                      <PiChalkboardTeacherLight size={22} />
                      <h2>{t('lecturer') || 'Lecturer'}</h2>
                    </div>
                  }
                  className="w-full"
                >
                  {renderFormFields}
                </Tab>

                <Tab
                  key="Student"
                  title={
                    <div className="flex items-center gap-2">
                      <PiStudentLight size={22} />
                      <h2>{t('student') || 'Student'}</h2>
                    </div>
                  }
                  className="w-full"
                >
                  {renderFormFields}
                </Tab>
              </Tabs>

              <Button 
                color="primary" 
                className="w-full mt-4" 
                type="submit"
                isDisabled={signUpLoading}
                startContent={
                  signUpLoading ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    <UserPlus size={17} />
                  )
                }
              >
                {signUpLoading ? t("registering") || "Registering..." : t("register") || "Register"}
              </Button>
            </Form>

            <div className="mt-4 flex items-center justify-center gap-2">
              <p className="dark:text-zinc-200 text-zinc-600">
                {t("haveAccount") || "Have an account?"}
              </p>
              <Link to="/login" className="text-blue-500 hover:underline">
                {t("login") || "Login"}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;