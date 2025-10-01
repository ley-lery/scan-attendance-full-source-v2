import { type ReactNode, createContext } from "react";

interface ModalContextProps {
    backgroundBlur: boolean;
}

export const ModalContext = createContext<ModalContextProps>({
    backgroundBlur: false,
});

