import { create } from "zustand";

const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    console.log("fetching users");
    set({ loading: true, error: null });

    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await res.json();
      set({ users: data, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch users", loading: false });
    }
  },
}));

export default useUserStore;
