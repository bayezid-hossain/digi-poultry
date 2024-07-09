import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";
import { api } from "@/trpc/react";
import { CyclesData } from "../../_types";

type UserDataStore = {
  data: string;
  setData: (userId: string) => void;
  getData: () => string;
};

type MyPersist = (
  config: StateCreator<UserDataStore>,
  options: PersistOptions<UserDataStore>,
) => StateCreator<UserDataStore>;

const useUserDataStore = create<UserDataStore>(
  (persist as MyPersist)(
    (set, get) => ({
      data: "",
      setData: (userId) => set({ data: userId }),
      getData: () => get().data,
    }),
    {
      name: "user-data-store", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useUserDataStore;
