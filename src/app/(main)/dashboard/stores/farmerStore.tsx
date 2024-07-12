import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";
import { api } from "@/trpc/react";
import { FarmerData } from "../(functionalities)/farmers/Farmers";

type FarmerDataStore = {
  data: FarmerData[];
  addData: (newData: FarmerData) => void;
  setData: (newData: FarmerData[]) => void;
  removeData: (id: string) => void;
  updateData: (id: string, newData: FarmerData) => void;
  filterData: (id: string) => FarmerData[];
  isFetching: boolean;
};

const useFarmerDataStore = create<FarmerDataStore>((set, get) => ({
  data: [],
  addData: (newData) => set((state) => ({ data: [...state.data, newData] })),
  setData: (newData) => set((state) => ({ data: newData })),
  updateData: (id, newData) =>
    set((state) => ({
      data: state.data.map((item) => (item.id === id ? newData : item)),
    })),
  removeData: (id) => set((state) => ({ data: state.data.filter((item) => item.id !== id) })),
  isFetching: false,
  filterData: (id) => get().data.filter((item) => item.id === id),
}));

export default useFarmerDataStore;
