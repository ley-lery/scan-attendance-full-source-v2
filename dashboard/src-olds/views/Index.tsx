import Navbar from "@/layouts/Navbar";
import Sidebar from "@/layouts/Sidebar";
import { useToggleStore } from "@/stores/userToggleStore";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const Index = () => {
  const setUseToggle = useToggleStore((state) => state.setIsOpen);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => { 
    setIsSidebarOpen((prev) => !prev)
    setUseToggle();
  };

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-20" : "w-64"
        } transition-all duration-300 ease-in-out flex-shrink-0`}
      >
        <Sidebar toggle={isSidebarOpen} />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Navbar */}
        <nav className="h-16 w-full flex-shrink-0 z-10">
          <Navbar toggle={handleSidebarToggle} />
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden rounded-tl-3xl border-l border-t border-zinc-200 dark:border-zinc-700">
          <div className="overflow-y-auto has-scrollbar">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;