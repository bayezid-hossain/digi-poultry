import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";
import { api } from "@/trpc/react";
import { CyclesData } from "../../_types";

type UserDataStore = {
  data: string;
  setData: (userId: string) => void;
  getData: () => string;
};

const useUserDataStore = create<UserDataStore>((set, get) => ({
  data: "",
  setData: (userId) => set({ data: userId }),
  getData: () => get().data,
}));

export default useUserDataStore;
