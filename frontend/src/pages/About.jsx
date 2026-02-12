import React, { useState, useEffect } from 'react';
import SeriousIcons from '../../components/SeriousIcons';

const About = () => {
  const [logs, setLogs] = useState([]);
  
  const architects = [
    { 
      name: "Andrii Malakhovtsev", 
      role: "Lead System Architect + Front-End", 
      isLead: true, 
      bio: "Brought the original idea, outlined fully on a diagram, collected team members and managed for 24 hours during a hackathon. Refactored and deployed the app for final demo state.",
      tags: ["System Design", "Trello administration", "React", "Force-Graph", "Tailwind", "Full-stack refactoring", "Deployment"],
      socials: { 
        website: "https://andrii-malakhovtsev.com/", 
        github: "https://github.com/andrii-malakhovtsev",
        linkedin: "https://www.linkedin.com/in/andrii-malakhovtsev/", 
        email: "mailto:andrii.malakhovtsev@gmail.com", 
        discord: "andrii.mal" 
      }
    },
    { 
      name: "Sulav Pradhan", 
      role: "Full-Stack + Project Manager", 
      bio: "Directed the project in specific way to get as much done as possible in 24 hrs.",
      tags: ["ZuStand", "Node.js", "DB structure", "Project Managing", "Full-stack refactoring"],
      socials: { 
        github: "https://github.com/sulav-pradhan",
        linkedin: "https://www.linkedin.com/in/sulav-pradhan/",
        discord: "#sulavpradhan" 
      }
    },
    { 
      name: "Wens Kedar Barambona", 
      role: "Full-Stack", 
      bio: "Fixed the stuff under real-time pressure. True warrior.",
      tags: ["Node.js", "DB structure", "API endpoints", "TypeScript", "Full-stack refactoring"],
      socials: { 
        github: "https://github.com/b-wens-kedar",
        linkedin: "https://www.linkedin.com/in/wens-kedar-barambona-5408b4319/", 
        discord: "#kdr_257" 
      }
    },
    { 
      name: "Owen Kemp", 
      role: "Back-End + DevOps", 
      bio: "API endpoints, Dockerizing the app, fixing Prisma.scheme? Ping him.",
      tags: ["Docker", "Node.js", "TypeScript", "RESTful API", "Prisma"],
      socials: { 
        github: "https://github.com/Striker2783",
        discord: "#striker2783"
      }
    },
    { 
      name: "Brianna Persinger", 
      role: "Overall Help", 
      bio: "Help on styling and presentation, corrections on initial database structure and some stack choices.",
      tags: ["Tailwind", "Front-end refactorting", "Presentation"],
      socials: { 
        github: "https://github.com/BBBree",
        linkedin: "https://www.linkedin.com/in/brianna-persinger-tech/",
        discord: "#evilmonkey1999" 
      }
    }
  ];

  useEffect(() => {
    const bootMessages = [
      "> npm run start:production",
      "> [NodeJS] v20.10.0 checking environment...",
      "> [ReactJS] Hydrating Virtual DOM clusters...",
      "> [Vite] Optimized build modules loaded.",
      "> Connecting to Postgres/Relay API...",
      "> Handshake: 200 OK",
      "> UI RE-RENDERED IN 14ms.",
      "> SYSTEM STANDBY: Ready for analysis."
    ];
    bootMessages.forEach((msg, i) => {
      setTimeout(() => setLogs(prev => [...prev, msg]), i * 250);
    });
  }, []);

  return (
    <div className="absolute inset-0 bg-[#050505] z-50 overflow-y-auto custom-scrollbar flex flex-col">
      
      {/* HEADER */}
      <section className="min-h-[50vh] flex flex-col justify-center px-8 md:px-20 border-b border-white/5 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
        <div className="flex items-center gap-4 mb-6">
          <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black tracking-[.3em] uppercase rounded-sm animate-pulse">
            Demo Version
          </div>
          <div className="h-[1px] w-20 bg-white/20"></div>
        </div>
        
        <h1 className="text-6xl md:text-[10rem] font-black leading-[0.8] tracking-tighter uppercase italic">
          TEAM<br />
          <span className="text-blue-600">ACCOUNTMAP</span>
        </h1>
      </section>

      {/* THE ARCHITECTS GRID */}
      <section className="p-8 md:p-20 bg-black">
        <h2 className="text-blue-500 font-black text-xs uppercase tracking-[0.5em] flex items-center gap-4 mb-16">
          <SeriousIcons.Sparkle className="w-4 h-4" /> Nice to meet you! 
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-24">
          {architects.map((person, idx) => (
            <div 
              key={idx} 
              className={`group border-t pt-8 transition-all duration-500 ${
                person.isLead ? 'border-yellow-500 shadow-[0_-20px_50px_-20px_rgba(250,204,21,0.2)]' : 'border-white/10 hover:border-blue-600'
              }`}
            >
              <p className={`${person.isLead ? 'text-yellow-400 font-black' : 'text-blue-600'} font-mono text-[10px] mb-2 tracking-[0.3em] uppercase`}>
                [{person.role}]
              </p>
              
              <h3 className={`text-5xl font-black uppercase tracking-tighter transition-colors mb-4 ${
                person.isLead ? 'text-yellow-500 group-hover:text-white' : 'text-white group-hover:text-blue-400'
              }`}>
                {person.name}
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-10 min-h-[48px]">
                {person.bio}
              </p>

              {/* DYNAMIC CONTACTS GRID */}
              <div className="flex flex-col gap-3 mb-10">
                
                {/* PRIMARY ACTIONS - Resume / Portfolio / GitHub */}
                {(person.socials.resume || person.socials.website || person.socials.github) && (
                  <div className="flex flex-wrap gap-2">
                    {person.socials.resume && (
                      <a href={person.socials.resume} target="_blank" rel="noreferrer" className={`flex-1 min-w-[100px] text-center py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-sm border ${
                        person.isLead ? 'bg-yellow-500 text-black border-yellow-400 hover:bg-white' : 'bg-white text-black border-white hover:bg-blue-600 hover:text-white'
                      }`}>
                        Resume
                      </a>
                    )}
                    {person.socials.website && (
                      <a href={person.socials.website} target="_blank" rel="noreferrer" className={`flex-1 min-w-[100px] text-center py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-sm border ${
                        person.isLead ? 'border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/10' : 'border-white/20 text-white hover:bg-white/10'
                      }`}>
                        Portfolio
                      </a>
                    )}
                    {person.socials.github && (
                      <a href={person.socials.github} target="_blank" rel="noreferrer" className={`flex-1 min-w-[100px] text-center py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-sm border ${
                        person.isLead ? 'border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/10' : 'border-white/20 text-white hover:bg-white/10'
                      }`}>
                        GitHub
                      </a>
                    )}
                  </div>
                )}

                {/* SECONDARY CONNECTS */}
                <div className="flex gap-2">
                  {person.socials.linkedin && (
                    <a href={person.socials.linkedin} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 text-[9px] font-bold text-slate-500 border border-white/5 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest">
                      LinkedIn
                    </a>
                  )}
                  {person.socials.email && (
                    <a href={person.socials.email} className="flex-1 text-center py-2 text-[9px] font-bold text-slate-500 border border-white/5 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest">
                      Email
                    </a>
                  )}
                  {person.socials.discord && (
                    <div className="group/disc flex-1 relative">
                      <div className="w-full text-center py-2 text-[9px] font-bold text-slate-500 border border-white/5 hover:text-white hover:border-white/20 transition-all cursor-help uppercase tracking-widest">
                        Discord
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/disc:opacity-100 transition-all bg-blue-600 text-white text-[9px] px-2 py-1 font-mono rounded pointer-events-none shadow-xl z-20 whitespace-nowrap">
                        {person.socials.discord}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {person.tags.map(tag => (
                  <span key={tag} className={`text-[8px] px-2 py-1 border uppercase font-black tracking-widest ${
                    person.isLead ? 'border-yellow-500/20 text-yellow-500/40' : 'border-white/5 text-slate-700'
                  }`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* SYSTEM CONSOLE */}
          <div className="xl:col-span-1 bg-[#070707] border border-blue-500/20 rounded-lg p-6 font-mono text-[11px] h-[400px] flex flex-col shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/40" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                <div className="w-2 h-2 rounded-full bg-green-500/40" />
              </div>
              <span className="text-blue-500/50 uppercase tracking-[0.2em] text-[8px]">stack_init.sh</span>
            </div>
            
            <div className="flex-1 space-y-2 text-blue-400/80">
              {logs.map((log, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <span className="text-white/10 select-none mr-2">{i}</span>
                  {log}
                </div>
              ))}
              <div className="w-2 h-4 bg-blue-600 animate-pulse inline-block align-middle ml-1"></div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="h-32 w-full" />

      <footer className="sticky bottom-0 w-full mt-auto z-[60]">
        <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-xl border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]" />
        
        <div className="relative px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="flex gap-3 opacity-30">
               <SeriousIcons.TwoD className="w-4 h-4" />
               <SeriousIcons.ThreeD className="w-4 h-4" />
            </div>
            <span className="text-slate-600 text-[9px] font-black uppercase tracking-[.4em] hidden md:block border-l border-white/10 pl-4">
              Every hour counts - <a href="https://www.wright.edu/events/hackathon">Make-It-Wright 2026</a>
            </span>
          </div>

          <div className="flex flex-col md:items-end">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[.2em]">
              © {new Date().getFullYear()} AccountMap
            </p>
            <p className="text-[8px] text-blue-500/40 font-mono uppercase tracking-tighter">
              Refactored Demo of Hackathon_Build
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;