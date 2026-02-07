import React, { useState, useMemo } from 'react';
import Header from './../components/Header';
import Sidebar from './../components/Sidebar';
import MapView from './pages/MapView';
import ListView from './pages/ListView';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('map');
  const [selectedId, setSelectedId] = useState(null);

  const data = useMemo(() => {
    const hubs = [
      { id: 'h1', name: 'Gmail', isHub: true, label: 'Work Email', notes: 'Primary corporate identity' },
      { id: 'h2', name: 'iPhone', isHub: true, label: 'Personal Phone', notes: 'Hardware MFA device' },
      { id: 'h3', name: 'Authy', isHub: true, label: 'Authenticator', notes: 'Stored on encrypted vault' },
      { id: 'h4', name: 'Yubico', isHub: true, label: 'Yubikey 5C', notes: 'Physical security key' },
      { id: 'h5', name: 'ProtonMail', isHub: true, label: 'Recovery Email', notes: 'Encrypted backup channel' }
    ];

    const accounts = [
      { id: 'a1', name: 'Google', username: 'admin@nexus.io', hubIds: ['h1', 'h2'], notes: 'Super Admin access' },
      { id: 'a2', name: 'GitHub', username: 'dev-lead', hubIds: ['h1', 'h3', 'h4'], notes: 'Org owner' },
      { id: 'a3', name: 'Stripe', username: 'finance-main', hubIds: ['h2', 'h5'], notes: 'Bank account access' },
      { id: 'a4', name: 'AWS', username: 'root-prod', hubIds: ['h3', 'h4'], notes: 'Infrastructure control' },
      { id: 'a5', name: 'Slack', username: 'nexus-internal', hubIds: ['h1'], notes: 'Daily comms' },
      { id: 'a6', name: 'Figma', username: 'design-lead', hubIds: [], notes: 'Standalone account' },
      { id: 'a7', name: 'Vercel', username: 'deployment', hubIds: ['h1', 'h3'], notes: 'CI/CD access' },
      { id: 'a8', name: 'DigitalOcean', username: 'droplet-mgr', hubIds: ['h1', 'h5'], notes: 'Legacy servers' },
      { id: 'a9', name: 'Cloudflare', username: 'dns-admin', hubIds: ['h4', 'h5'], notes: 'Domain management' },
      { id: 'a10', name: 'Postman', username: 'api-tester', hubIds: ['h1'], notes: 'API documentation' },
      { id: 'a11', name: 'Linear', username: 'pm-lead', hubIds: ['h1', 'h3'], notes: 'Project tracking' },
      { id: 'a12', name: 'Zoom', username: 'corp-meet', hubIds: ['h2'], notes: 'Enterprise video' },
      { id: 'a13', name: 'Notion', username: 'wiki-editor', hubIds: ['h1'], notes: 'Knowledge base' },
      { id: 'a14', name: 'Sentry', username: 'debug-user', hubIds: ['h1', 'h3'], notes: 'Error monitoring' },
      { id: 'a15', name: 'Discord', username: 'community-mod', hubIds: ['h3'], notes: 'Dev community' },
      { id: 'a16', name: 'Heroku', username: 'old-apps', hubIds: [], notes: 'Unprotected legacy apps' },
      { id: 'a17', name: 'Atlassian', username: 'jira-adm', hubIds: ['h1', 'h4'], notes: 'Issue tracking' },
      { id: 'a18', name: 'Bitbucket', username: 'repo-mgr', hubIds: ['h1', 'h4'], notes: 'Source control backup' },
      { id: 'a19', name: 'Microsoft', username: 'azure-user', hubIds: ['h2', 'h5'], notes: 'Azure AD access' },
      { id: 'a20', name: 'Intercom', username: 'support-dev', hubIds: ['h1'], notes: 'Customer messaging' }
    ];

    const links = accounts.flatMap(acc => 
      acc.hubIds.map(hubId => ({ source: hubId, target: acc.id }))
    );

    return { nodes: [...hubs, ...accounts], accounts, links };
  }, []);

  const handleSelectAccount = (entity) => {
    setSelectedId(entity.id);
    setIsSidebarOpen(true);
  };

  const selectedAccount = data.nodes.find(n => n.id === selectedId);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white overflow-hidden">
      <div className="flex flex-col h-full w-full items-stretch">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        
        <main className="flex-1 w-full relative overflow-hidden bg-[#111]">
          {currentView === 'map' ? (
            <MapView 
              nodes={data.nodes} 
              links={data.links}
              onSelectAccount={handleSelectAccount} 
              selectedId={selectedId} 
            /> 
          ) : (
            <ListView 
              accounts={data.accounts} 
              allNodes={data.nodes} 
              onSelectAccount={handleSelectAccount} 
              selectedId={selectedId} 
            />
          )}
        </main>
      </div>

      <div className="absolute right-0 top-16 bottom-0 z-50 pointer-events-none">
         <Sidebar 
           isOpen={isSidebarOpen} 
           selectedAccount={selectedAccount} 
           allNodes={data.nodes}
         />
      </div>
    </div>
  );
}

export default App;