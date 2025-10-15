import Particle from "@/components/ui/configs/Particles";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import FuzzyText from "@/components/ui/text-animation/FuzzyText";
import ShinyText from "@/components/ui/text-animation/ShinyText";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); // Navigates back one step in history
  };
  return (
    <>
      <div className="relative z-20 flex h-screen items-center justify-center bg-black">
      <Particle />
        <div className="space-y-6 text-center flex flex-col items-center relative z-30">
          <ShinyText
            text="Page Not Found"
            disabled={false}
            speed={2}
            className="max-w-80 text-2xl font-semibold"
          />
          <FuzzyText baseIntensity={0.2}>404</FuzzyText>
          {/* <p className="text-zinc-400">Page Not Found</p> */}
          <p className="text-zinc-400">
            I tried to catch som fog, but i missed it.
          </p>
            <button onClick={handleBack} className="flex items-center gap-2 rounded-2xl border border-gray-500 bg-transparent px-6 py-2 transition-colors duration-300 hover:bg-white/10 text-zinc-200 cursor-pointer">
              <FaLongArrowAltLeft className="text-2xl text-zinc-500" />
              <ShinyText
                text="Go Back Home"
                disabled={false}
                speed={2}
                className="max-w-80 text-base"
              />
            </button>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
