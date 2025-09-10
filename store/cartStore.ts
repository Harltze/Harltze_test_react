import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProductInterface } from "../interfaces/ProductInterface";
import { v4 } from "uuid";

export interface SizeAndColor {
  id?: string;
  colorCode: string;
  color: string;
  size: string;
  sku?: string;
  pictures: string[];
  quantity?: number;
  quantityAvailable?: number;
}

export interface ProductWithQuantity extends ProductInterface {
  sizeColorQuantity?: SizeAndColor[];
}

type QuantityAction = "increase" | "decrease" | "reset";

interface Store {
  cart: ProductWithQuantity[];
  addToCart: (product: any, variations: SizeAndColor[]) => void;
  modifyQuantity: (
    productId: string,
    size: string,
    color: string,
    colorCode: string,
    action: QuantityAction
  ) => void;
  removeProductVariation: (
    productId: string,
    size: string,
    color: string,
    colorCode: string
  ) => void;
  updateProductVariation: (productId: string, SQC: SizeAndColor) => void;
  emptyCart: () => void;
  removeProduct: (productId: string) => void;
  isInCart: (productId: string) => boolean;
}

export const cartStore = create<Store>()(
  persist(
    (set, get) => ({
      cart: [],
      emptyCart: () =>
        set((_state) => {
          return { cart: [] };
        }),
      addToCart: (product, variations) =>
        set((state) => {
          const value = variations.find((v) => v.size == "" || v.quantity == 0);
          if (!product || value) {
            return { cart: state.cart };
          }

          const productExists = state.cart.find(
            (s: any) => s?._id == product._id
          );

          if (!productExists) {
            const variationsWithIds = variations.map((v: SizeAndColor) => ({...v, id: v4()}));
            product.sizeColorQuantity = variationsWithIds;

            return { cart: [product, ...state.cart] };
          } else {
            return { cart: state.cart };
          }
        }),
      updateProductVariation: (productId, sqc) =>
        set((state) => {
          if (!productId || !sqc.color || !sqc.colorCode || !sqc.size) {
            return { cart: state.cart };
          }

          const product = state.cart.find((p) => p._id == productId);

          if (!product) return { cart: state.cart };

          console.log(sqc);

          const findSQC = product.sizeColorQuantity?.find(
            (value: SizeAndColor) =>
              value.color == sqc.color &&
              value.colorCode == sqc.colorCode &&
              value.size == sqc.size
          );

          // const updatedProducts = state.cart.map((pwc: ProductWithQuantity) => {
          //   if(pwc?._id == productId) {
          //     pwc.sizeColorQuantity = sqc;
          //   }
          //   return pwc;
          // });

          if (findSQC) {
            const v = product.sizeColorQuantity!!.map((value: SizeAndColor) => {
              if (
                value.color == sqc.color &&
                value.colorCode == sqc.colorCode &&
                value.size == sqc.size
              ) {
                return { ...value, quantity: sqc.quantity };
              }
              return value;
            }).filter(value => 
                value.quantity!! > 0
            );

            if(v.length == 0) {
              const updatedProducts = state.cart.filter((value) => (value._id != productId));
              return {cart: updatedProducts}
            }

            const updatedProducts = state.cart.map(
              (value: ProductWithQuantity) => {
                if (value._id == product._id) {
                  return { ...value, sizeColorQuantity: v };
                }
                return value;
              }
            );
            return { cart: updatedProducts };
          } else {
            const updatedProductSQC = [sqc, ...product.sizeColorQuantity!!];
            const updatedProducts = state.cart.map(
              (value: ProductWithQuantity) => {
                if (value._id == product._id) {
                  return {
                    ...value,
                    sizeColorQuantity: updatedProductSQC,
                  };
                }
                return value;
              }
            );
            return { cart: updatedProducts };
          }
        }),
      modifyQuantity: (productId, size, color, colorCode, action) =>
        set((state) => {
          const product = state.cart.find((p) => p._id == productId);

          if (!product) return { cart: state.cart };

          const newSCQ = product.sizeColorQuantity?.map((SCQ) => {
            if (
              SCQ.color == color &&
              SCQ.size == size &&
              SCQ.colorCode == colorCode
            ) {
              console.log("scq", SCQ);
              if (action == "increase") {
                SCQ.quantity!! += 1;
              } else if (action == "decrease") {
                if (SCQ.quantity!! > 0) {
                  SCQ.quantity!! -= 1;
                }
              } else if (action == "reset") {
                SCQ.quantity = 0;
              }
            }
            return SCQ;
          });

          product.sizeColorQuantity = newSCQ;

          return {
            cart: state.cart.map((p) => {
              if (p._id == product._id) {
                return product;
              } else {
                return p;
              }
            }),
          };
        }),
      removeProductVariation: (productId, size, color, colorCode) =>
        set((state) => {
          const product = state.cart.find((s) => s._id == productId);

          if (!product) return { cart: state.cart };
          console.log("productId, size, color, colorCode", productId, size, color, colorCode);
          const variationToRemove = product?.sizeColorQuantity?.find(
            (value) =>
              (value.color == color &&
                value.colorCode == colorCode &&
                value.size == size)
          );
          console.log("variationToRemove", variationToRemove);
          const updatedVariation = product?.sizeColorQuantity?.filter(
            (value) =>
              (value.sku != variationToRemove?.sku)
          );

          if (updatedVariation?.length == 0) {
            const updatedProducts = state.cart.filter(
              (v) => v._id != productId
            );
            return {
              cart: updatedProducts!!,
            };
          } else {
            const updatedProduct = state.cart.map((c) => {
              if (c._id == product._id) {
                return {
                  ...product,
                  sizeColorQuantity: updatedVariation!!,
                };
              }
              return c;
            });
            return { cart: updatedProduct!! };
          }

          // if(product.sizeColorQuantity!!.length == 1) {
          //   const productWithAtLeastOneVariation = state.cart.filter(p => p._id != product._id);
          //   return {cart: productWithAtLeastOneVariation}
          // }

          // if(product.sizeColorQuantity!!.length > 0) {

          //   const updatedSQC = product.sizeColorQuantity?.filter((value) => value.size != size && value.color != color && value.colorCode != colorCode);
          //   const updatedProduct = state.cart.map((p: ProductWithQuantity) => {
          //     if(p._id == product._id) {
          //       product.sizeColorQuantity = updatedSQC;
          //     }
          //     return p;
          //   });
          //   return {cart: updatedProduct}
          // } else {
          //   return {cart: state.cart};
          // }
        }),
      removeProduct: (productId) =>
        set((state) => {
          const product = state.cart.find((s) => s._id == productId);

          if (product) {
            const updatedCart = state.cart.filter((c) => c._id != product._id);

            return { cart: updatedCart };
          } else {
            return { cart: state.cart };
          }
        }),
      isInCart: (productId) => {
        const cart = get().cart;
        console.log(cart);
        const product = cart.find((c) => c?._id == productId);

        // if(product) {
        // } else {
        //   return false;
        // }
        return product != null;
      },
    }),
    {
      name: "cartstore",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
