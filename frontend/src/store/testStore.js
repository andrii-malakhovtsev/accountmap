import { create } from 'zustand';

const useTestStore = create((set) => ({
  entities: [
    { 
      id: 'h1', 
      value: 'work@nexus.io', 
      type: 'mail', 
      notes: 'Primary corporate email for internal tools.',
      accounts: [
        { id: 'a1', name: 'Netflix', username: 'dev-lead', notes: 'Shared engineering plan' },
        { id: 'a2', name: 'AWS', username: 'root-admin', notes: 'Main infrastructure account' },
        { id: 'a4', name: 'Slack', username: 'nexus-admin', notes: 'Enterprise workspace' },
        { id: 'a7', name: 'GitHub', username: 'lead-dev-nexus', notes: 'Organization owner' }
      ] 
    },
    { 
      id: 'h2', 
      value: '+1 (555) 000-1111', 
      type: 'phone', 
      notes: 'Recovery phone for high-security accounts.',
      accounts: [
        { id: 'a1', name: 'Netflix', username: 'dev-lead', notes: '2FA Backup' },
        { id: 'a3', name: 'Stripe', username: 'finance-mgr', notes: 'Financial operations' },
        { id: 'a5', name: 'Discord', username: 'nexus_alpha', notes: 'Internal community' }
      ] 
    },
    { 
      id: 'h3', 
      value: 'Google Auth', 
      type: 'auth', 
      notes: 'Hardware-bound authenticator app.',
      accounts: [
        { id: 'a2', name: 'AWS', username: 'root-admin', notes: 'Strict MFA enabled' },
        { id: 'a3', name: 'Stripe', username: 'finance-mgr', notes: 'Critical financial access' },
        { id: 'a6', name: 'Azure', username: 'cloud-ops', notes: 'Legacy system portal' }
      ] 
    },
    { 
      id: 'h4', 
      value: 'personal@icloud.com', 
      type: 'mail', 
      notes: 'Personal backup and hobby accounts.',
      accounts: [
        { id: 'a5', name: 'Discord', username: 'nexus_alpha', notes: 'Personal Discord link' },
        { id: 'a8', name: 'Spotify', username: 'nexus_grooves', notes: 'Premium family plan' },
        { id: 'a9', name: 'Twitter', username: '@nexus_updates', notes: 'Official brand handle' }
      ] 
    },
    { 
      id: 'h5', 
      value: '+44 7700 900012', 
      type: 'phone', 
      notes: 'International roaming SIM for travel.',
      accounts: [
        { id: 'a6', name: 'Azure', username: 'cloud-ops', notes: 'Secondary recovery phone' },
        { id: 'a10', name: 'Uber', username: 'nexus_travel', notes: 'Corporate travel profile' }
      ] 
    },
    { 
      id: 'h6', 
      value: 'YubiKey 5C', 
      type: 'auth', 
      notes: 'Physical security key (Hardware).',
      accounts: [
        { id: 'a7', name: 'GitHub', username: 'lead-dev-nexus', notes: 'Hardware MFA enforced' },
        { id: 'a2', name: 'AWS', username: 'root-admin', notes: 'Break-glass access key' }
      ] 
    }
  ]
}));

export default useTestStore;