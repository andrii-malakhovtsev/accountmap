import { create } from "zustand";

const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });

    try {
      console.log("inside fetchUsers");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/identities/map`);
      const data = await res.json();
      set({ users: data, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch users", loading: false });
    }
  },
}));

export default useUserStore;
