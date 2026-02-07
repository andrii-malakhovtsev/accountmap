import { create } from "zustand";

const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });

    try {
      console.log("inside fetchUsers");
      const res = await fetch("http://localhost:8081/api/identities/map");
      const data = await res.json();
      set({ users: data, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch users", loading: false });
    }
  },
}));

export default useUserStore;
