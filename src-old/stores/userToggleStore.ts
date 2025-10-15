import {create} from 'zustand';

interface ToggleState {
    isOpen: boolean;
    setIsOpen: () => void;
}
export const useToggleStore = create<ToggleState>((set) => ({
    isOpen: false,
    setIsOpen: () => set((state) => ({isOpen: !state.isOpen})),
}));
