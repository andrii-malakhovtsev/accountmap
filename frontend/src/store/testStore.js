import { create } from 'zustand';

const useTestStore = create((set) => ({
  entities: [
    { 
      id: 'h1', 
      value: 'work@nexus.io', 
      type: 'mail', 
      accounts: [
        { id: 'a1', name: 'Netflix', username: 'dev-lead', notes: 'Shared plan' },
        { id: 'a2', name: 'AWS', username: 'root-admin', notes: 'Infrastructure' }
      ] 
    },
    { 
      id: 'h2', 
      value: '+1 (555) 000-1111', 
      type: 'phone', 
      accounts: [
        { id: 'a1', name: 'Netflix', username: 'dev-lead', notes: 'Shared plan' },
        { id: 'a3', name: 'Stripe', username: 'finance-mgr', notes: '' }
      ] 
    },
    { 
      id: 'h3', 
      value: 'Google Auth', 
      type: 'auth', 
      accounts: [{ id: 'a2', name: 'AWS', username: 'root-admin' }] 
    }
  ]
}));

export default useTestStore;