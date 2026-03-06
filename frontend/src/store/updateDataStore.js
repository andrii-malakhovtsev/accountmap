import { create } from "zustand";

const updateDataStore = create((set) => ({
  accounts: [],
  loading: false,
  error: null,

  setAccounts: (accounts) => set({ accounts }),

  uploadBulkAccounts: async (accounts) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accounts),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.message || data.error || "Upload failed";
        set({ error: msg, loading: false });
        throw new Error(msg);
      }
      set({ accounts: data, loading: false });
      return data;
    } catch (err) {
      if (err.message) set({ error: err.message, loading: false });
      else set({ error: "Failed to upload accounts", loading: false });
      throw err;
    }
  },
}));

export default updateDataStore;
