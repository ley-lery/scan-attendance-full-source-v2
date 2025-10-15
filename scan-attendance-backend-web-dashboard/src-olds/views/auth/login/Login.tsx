import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import AuthService from "@/services/auth.service";
import { Button, Checkbox, Input, Select, SelectItem, Spinner } from "@heroui/react";
import { Form } from "@heroui/react";
import { IoMailOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import UniLogo from "@/assets/logo/bbu-logo.png";
import ShowToast from "@/components/hero-ui/toast/ShowToast";
import ThemeSwitcher from "@/components/ui/theme/ThemeSwitch";
import { Eye, EyeOff, Facebook, LogIn, Mail, Phone } from "lucide-react";
import SwitchTranslate from "@/components/ui/switch/SwitchTranslate";

// Types
interface LecturerData {
  email: string;
  password: string;
}


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
  isSubmitting?: boolean;
}

// Background Constants
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
  { icon: Facebook, href: "#", label: "Facebook", text: "bbu@official" },
  { icon: Mail, href: "mailto:bbu@edu.kh.com", label: "Email", text: "bbu@edu.kh.com" },
  { icon: Phone, href: "tel:+85512345678", label: "Phone", text: "+855 12 345 678" }
];

const NAVIGATION_DELAY = 1000;

// Components
const CustomInput: React.FC<CustomInputProps> = ({ label, name, placeholder, type, value, onChange, endContent, isRequired = false, isSubmitting = false }) => (
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
    className="w-full"
    classNames={{
      inputWrapper: "border-zinc-300 dark:border-zinc-600",
      label: "dark:text-zinc-300 text-zinc-600",
    }}
    isDisabled={isSubmitting}
  />
);

const ContactInfo: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="lg:max-w-96 text-center lg:text-left text-base">
      <p className="mb-2 text-zinc-500 dark:text-zinc-400">
        {t("contactMessage") || "If you have any questions or need assistance, feel free to contact us:"}
      </p>
      <ul className="gap-2 flex flex-row lg:flex-col *:items-center *:gap-2 *:flex">
        {CONTACT_LINKS.map((contact) => (
          <li key={contact.label}>
            <contact.icon size={20} className="text-blue-400" />
            <a 
              href={contact.href} 
              className="text-blue-400 hover:underline"
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
      className="flex flex-col space-y-4 pr-4 justify-between"
    >
      <div className="flex flex-col gap-4 text-center lg:text-left w-full lg:w-96">
        <h2 className="text-3xl font-semibold text-zinc-700 dark:text-white">
          {t("welcomeBack") || "Welcome Back!"}
        </h2>
        <p className="text-base text-zinc-500 dark:text-zinc-400">
          {t("loginDescription") || "To access your management system account, please enter your email and password below."}
        </p>
        <p className="text-base text-zinc-500 dark:text-zinc-400">
          {t("noAccountMessage") || "Don't have an account yet? Please contact the administrator to create one for you."}
        </p>
      </div>
      <ContactInfo />
    </motion.div>
  );
};

const TopBar: React.FC<{ selectedBackground: string; onBackgroundChange: (bg: string) => void;}> = ({ onBackgroundChange }) => (
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

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // State
  const [selectedBackground, setSelectedBackground] = useState<string>("bg-auth");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<LecturerData>({
    email: "",
    password: "",
  });

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handleBackgroundChange = (bg: string) => {
    setSelectedBackground(bg);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const response = await AuthService.lecturerSignIn(formData);
  
      if (response?.data?.token) {
        const account = { user: response.data.user, token: response.data.token };
        login(account);
        ShowToast({
          color: "success",
          title: "Login Successful",
          description: "You have successfully logged in.",
        });
        // Navigate immediately after login - no reload needed!
        setTimeout(() => navigate("/system/dashboard"), NAVIGATION_DELAY);
        // REMOVED: setTimeout(() => handleReload(), RELOAD_DELAY);
      } else {
        ShowToast({
          color: "danger",
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
        });
      }
    } catch (error: any) {
      ShowToast({
        color: "danger",
        title: "Login Failed",
        description: error?.response?.data?.message || "An error occurred during login.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPasswordToggle = () => (
    <button type="button" onClick={togglePasswordVisibility} aria-label="Toggle password visibility">
      {isPasswordVisible ? (
        <Eye size={17} className="text-zinc-500 dark:text-zinc-300" />
      ) : (
        <EyeOff size={17} className="text-zinc-500 dark:text-zinc-300" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen w-full bg-[#fefcff] dark:bg-[#1e1e1e] relative flex items-center justify-center">
      <TopBar 
        selectedBackground={selectedBackground}
        onBackgroundChange={handleBackgroundChange}
      />
      
      <div className={`absolute inset-0 z-0 ${selectedBackground}`} />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 place-content-center gap-4">
        <WelcomeSection />
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center"
        >
          <div className="p-6 dark:bg-zinc-800/50 bg-white/50 backdrop-blur-sm rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg font-semibold text-zinc-700 dark:text-white">
                  {t("signInTitle") || "Sign In to Your Account"}
                </h1>
                <p className="text-small text-zinc-500 dark:text-zinc-400 max-w-60">
                  {t("signInSubtitle") || "Access your dashboard and continue where you left off."}
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
              className="relative flex w-full  py-3"
            >
                  <div className="space-y-2 w-full">
                    <CustomInput
                      isRequired
                      label={t("email")}
                      name="email"
                      placeholder={t("enterEmail")}
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      endContent={<IoMailOutline className="text-zinc-500" />}
                      isSubmitting={isSubmitting}
                    />
                    <CustomInput
                      isRequired
                      label={t("password")}
                      name="password"
                      placeholder={t("enterPassword")}
                      type={isPasswordVisible ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      endContent={renderPasswordToggle()}
                      isSubmitting={isSubmitting}
                    />
                  </div>
              
              <div className="flex w-full items-center justify-between px-1 py-2">
                <Checkbox name="remember" size="md">
                  {t("rememberMe") || "Remember me"}
                </Checkbox>
                <Link to="" className="text-sm text-zinc-500 dark:text-zinc-400 hover:underline">
                  {t("forgotPassword") || "Forgot password?"}
                </Link>
              </div>
              
              <Button 
                color="primary" 
                className="w-full" 
                type="submit"
                isDisabled={isSubmitting}
                startContent={
                  isSubmitting ? (
                    <Spinner variant="spinner" size="sm" color="white" />
                  ) : (
                    <LogIn size={17} />
                  )
                }
              >
                {isSubmitting ? t("loggingIn") || "Logging In..." : t("login")}
              </Button>
            </Form>
            
            <div className="flex items-center justify-center gap-2">
              <p className="text-zinc-600 dark:text-zinc-400">
                {t("noAccount") || "Don't have an account?"}
              </p>
              <Link to="/register" className="text-blue-500 hover:underline">
                {t("register") || "Register"}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;