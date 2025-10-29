import LoadingUi from "../hero-ui/loading/Loading";
import { useEffect } from "react";

const RouteFallback = () => {
 
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    }
  }, []);
  
  return (
    <div className={`h-screen flex flex-col gap-2 items-center justify-center bg-white dark:bg-zinc-900`}>
      <LoadingUi/>
    </div>
  );
};
export default RouteFallback;
