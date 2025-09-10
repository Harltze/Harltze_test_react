import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {v4} from "uuid";

export interface ShippingAddressDetails {
  id?: string;
  country?: string;
  state: string;
  city: string;
  address: string;
  isDefault?: boolean;
}

interface Store {
  shippingAddresses: ShippingAddressDetails[];
  addShippingAddress: (val: ShippingAddressDetails) => void;
  updateShippingAddress: (id: string, val: ShippingAddressDetails) => void;
  setAsDefaultShippingAddress: (id: string) => void;
  removeShippingAddress: (id: string) => void;
}

export const shippingAddressStore = create<Store>()(
  persist(
    (set) => ({
      shippingAddresses: [],
      addShippingAddress: (shippingAddressDetails: ShippingAddressDetails) =>
        set((state) => {
          shippingAddressDetails.id = v4();
          shippingAddressDetails.country = "Nigeria";
          shippingAddressDetails.isDefault = state.shippingAddresses.length == 0 || !(state.shippingAddresses.find(s => s.isDefault)) ? true : false;
          return { shippingAddresses: [shippingAddressDetails, ...state.shippingAddresses] };
        }),
        updateShippingAddress: (id, updatedShippingAddressDetails) =>
        set((state) => {

          const updatedShippingAddresses = state.shippingAddresses.map(shippingAddress => {
            if(shippingAddress.id == id) {
              return {
                ...shippingAddress,
                // country: updatedShippingAddressDetails.country,
                state: updatedShippingAddressDetails.state,
                city: updatedShippingAddressDetails.city,
                address: updatedShippingAddressDetails.address
              };
            }

            return shippingAddress;

          });

          return {shippingAddresses: updatedShippingAddresses}
        }),
        setAsDefaultShippingAddress: (id) =>
          set((state) => {
            
            const updatedShippingAddresses = state.shippingAddresses.map(shippingAddress => {
              if(shippingAddress.id == id) {
                return {
                  ...shippingAddress,
                  isDefault: true
                };
              }
  
              return {
                ...shippingAddress,
                isDefault: false
              };
  
            });
            
            return {shippingAddresses: updatedShippingAddresses}

          }),
          removeShippingAddress: (id) =>
            set((state) => {
              return {shippingAddresses: state.shippingAddresses.filter(shippingAddress => shippingAddress.id != id)}
            }),
    }),
    {
      name: "shippingaddressstore",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
