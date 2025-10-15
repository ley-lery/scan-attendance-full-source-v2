import { createContext, useContext } from 'react';

interface DrawerContextType {
  classNames: {
   drawer?: string;
   drawerContent?: string;
   drawerBody?: string;
   drawerFooter?: string;
   drawerHeader?: string;
  };
}

export const DrawerContext = createContext<DrawerContextType>({
  classNames: {
    drawer: "",
    drawerContent: "",
    drawerBody: "",
    drawerFooter: "",
    drawerHeader: "",
  }
});

export const useDrawerContext = () => useContext(DrawerContext);
