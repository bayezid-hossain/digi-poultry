import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";
import { api } from "@/trpc/react";
import { CyclesData } from "../../_types";

type CycleDataStore = {
  data: CyclesData[];
  addData: (newData: CyclesData) => void;
  setData: (newData: CyclesData[]) => void;
  removeData: (id: string) => void;
  updateData: (id: string, newData: CyclesData) => void;
  filterData: (id: string) => CyclesData[];
  isFetching: boolean;
};

type MyPersist = (
  config: StateCreator<CycleDataStore>,
  options: PersistOptions<CycleDataStore>,
) => StateCreator<CycleDataStore>;

const useCycleDataStore = create<CycleDataStore>(
  (persist as MyPersist)(
    (set, get) => ({
      data: [],
      addData: (newData) => set((state) => ({ data: [...state.data, newData] })),
      setData: (newData) => set((state) => ({ data: newData })),
      updateData: (id, newData) =>
        set((state) => ({
          data: state.data.map((item) => (item.id === id ? newData : item)),
        })),
      removeData: (id) =>
        set((state) => {
          const newData = state.data.filter((item) => item.id !== id);
          return { data: newData };
        }),
      isFetching: false,
      filterData: (id) => get().data.filter((item) => item.id === id),
    }),
    {
      name: "cycle-data-store", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCycleDataStore;
