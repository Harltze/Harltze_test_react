import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Store {
  showNewsletter: boolean;
  setShowNewsletter: (val: boolean) => void;
}

export const newsLetterStore = create<Store>()(
  persist(
    (set) => ({
      showNewsletter: true,
      setShowNewsletter: (value: boolean) =>
        set((_state) => {
          return { showNewsletter: value };
        }),
    }),
    {
      name: "newsletterstore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
