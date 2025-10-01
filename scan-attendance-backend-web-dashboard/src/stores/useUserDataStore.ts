import {create} from 'zustand';

interface UserData {
  user_id: string;
  username: string;
  email: string;
  is_active: boolean;
  assign_type: string;
  assign_to: number;
  role: string;
}

interface UserDataStore {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
}

export const useUserDataStore = create<UserDataStore>((set) => ({
  userData: null,
  setUserData: (data: UserData) => set({ userData: data }),
  clearUserData: () => set({ userData: null }),
}));