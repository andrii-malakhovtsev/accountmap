import { create } from "zustand";

const useTestStore = create((set) => ({
  entities: [],
  
  addRandomEntity: (type) => {
    const id = `test-${Date.now()}`;
    const newEntity = type === "account" 
      ? {
          id,
          name: ["Netflix", "Github", "Amazon", "Spotify"][Math.floor(Math.random() * 4)],
          username: `user_${Math.floor(Math.random() * 100)}`,
          notes: "Generated Account",
          isConnection: false,
        }
      : {
          id,
          name: ["ProtonMail", "Yubikey", "Work Phone"][Math.floor(Math.random() * 3)],
          type: ["mail", "auth", "phone"][Math.floor(Math.random() * 3)],
          value: "test@vault.os",
          notes: "Generated Connection",
          isConnection: true,
        };

    set((state) => ({ entities: [...state.entities, newEntity] }));
  },

  clearStore: () => set({ entities: [] })
}));

export default useTestStore;