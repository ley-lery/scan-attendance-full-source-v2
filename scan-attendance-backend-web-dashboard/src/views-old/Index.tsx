import Navbar from "@/layouts/Navbar";
import Sidebar from "@/layouts/Sidebar";
import { useToggleStore } from "@/stores/userToggleStore";
import {  useState } from "react";
import { Outlet } from "react-router-dom";
const Index = () => {
  const setUseToggle = useToggleStore((state) => state.setIsOpen);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => { 
    setIsSidebarOpen((prev) => !prev)
    setUseToggle();
  };


  return (
   <>
      <div className="flex h-screen bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
      <aside
        className={`${isSidebarOpen ? "w-20" : "min-w-64"} transition-all duration-300`}
      >
        <Sidebar toggle={isSidebarOpen} />
      </aside>
      <div className="block w-full">
        <nav className="h-14 w-full">
          <Navbar toggle={handleSidebarToggle} />
        </nav>
        <main className={`has-scrollbar h-[calc(100%-20px)] overflow-y-auto  rounded-tl-3xl border border-zinc-200 dark:border-zinc-800 `}>
          <Outlet />
        </main>
      </div>
    </div>
   </>
    
  );
};

export default Index;
