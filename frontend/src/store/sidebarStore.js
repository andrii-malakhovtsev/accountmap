import { create } from "zustand";
import useUserStore from "./dataStore"

const useSidebarStore = create((set) => ({
	loading: false,
	error: null,
	success: false,

	createAccount: async (accountData) => {
		set({ loading: true, error: null, success: false });
		try {
			// Remove type from account data
			const { type, value, ...dataWithoutType } = accountData;
			const res = await fetch("http://localhost:8081/api/accounts/add", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(dataWithoutType),
			});

			if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

			const data = await res.json();
			await useUserStore.getState().fetchUsers()
			set({ loading: false, success: true });
			return data;
		} catch (err) {
			set({ error: err.message || "Failed to create account", loading: false });
			throw err;
		}
	},

	createConnection: async (connectionData) => {
		set({ loading: true, error: null, success: false });
		try {
			const { name, username, ...dataWithoutType } = connectionData;
			// Keep type for connection
			const res = await fetch("http://localhost:8081/api/identities/add", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(connectionData),
			});

			if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

			const data = await res.json();
			await useUserStore.getState().fetchUsers()

			set({ loading: false, success: true });
			return data;
		} catch (err) {
			set({
				error: err.message || "Failed to create connection",
				loading: false,
			});
			throw err;
		}
	},

	linkConnection: async ({ accountId, identityId }) => {
		set({ loading: true, error: null, success: false });
		try {
			const res = await fetch(
				`http://localhost:8081/api/connections/add/${accountId}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ identity: { id: identityId } }),
				},
			);

			if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

			const data = await res.json();
			await useUserStore.getState().fetchUsers()
			set({ loading: false, success: true });
			return data;
		} catch (err) {
			set({ error: err.message || "Failed to link connection", loading: false });
			throw err;
		}
	},

	resetState: () => set({ loading: false, error: null, success: false }),
}));

export default useSidebarStore;
