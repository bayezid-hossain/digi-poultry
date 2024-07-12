import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";
import { StandardData } from "../../_types";
import { api } from "@/trpc/react";

type StandardDataStore = {
  data: StandardData[];
  addData: (newData: StandardData) => void;
  setData: (newData: StandardData[]) => void;
  removeData: (age: number) => void;
  updateData: (age: number, newData: StandardData) => void;
  filterData: (age: number) => StandardData[];
  isFetching: boolean;
};

const useStandardDataStore = create<StandardDataStore>((set, get) => ({
  data: [],
  addData: (newData) => set((state) => ({ data: [...state.data, newData] })),
  setData: (newData) => set((state) => ({ data: newData })),
  updateData: (age, newData) =>
    set((state) => ({
      data: state.data.map((item) => (item.age === age ? newData : item)),
    })),
  removeData: (age) => set((state) => ({ data: state.data.filter((item) => item.age !== age) })),
  isFetching: false,
  filterData: (age) => get().data.filter((item) => item.age === age),
}));

export default useStandardDataStore;
