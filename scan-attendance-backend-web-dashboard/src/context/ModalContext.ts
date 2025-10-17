import { createContext } from "react";

interface ModalContextProps {
    backgroundBlur: boolean;
    scrollBehavior?: boolean;
}

export const ModalContext = createContext<ModalContextProps>({
    backgroundBlur: false,
    scrollBehavior: false,
});

