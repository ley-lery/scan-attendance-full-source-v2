import { Button } from "@heroui/button";
import { useTranslation } from "react-i18next";
import KhFlag from "@/assets/flag/Flag_of_Cambodia.png";
import EnFlag from "@/assets/flag/Flag_of_the_United_Kingdom.png";
const SwitchTranslate = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    window.location.reload();
  };

  return (
    <div className="gap-1 flex">
      <Button
        onPress={() => changeLanguage("en")}
        variant={currentLanguage === "en" ? "solid" : "light"}
        radius="md"
        size="sm"
        disabled={currentLanguage === "en" ? true : false}
      >
        <img src={EnFlag} alt="english-flag" className="w-6 rounded-sm" />
        {t("english")}
      </Button>
      <Button
        onPress={() => changeLanguage("kh")}
        variant={currentLanguage === "kh" ? "solid" : "light"}
        radius="md"
        size="sm"
        disabled={currentLanguage === "kh" ? true : false}
      >
        <img src={KhFlag} alt="khmer-flag" className="w-5" />
        {t("khmer")}
      </Button>
    </div>
  );
};

export default SwitchTranslate;
