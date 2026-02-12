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
      "> [NodeJS] v20.10.0 checking env...",
      "> [ReactJS] Hydrating clusters...",
      "> [Vite] Optimized build loaded.",
      "> Handshake: 200 OK",
      "> UI RE-RENDERED IN 14ms.",
      "> SYSTEM STANDBY."
    ];
    bootMessages.forEach((msg, i) => {
      setTimeout(() => setLogs(prev => [...prev, msg]), i * 200);
    });
  }, []);

  return (
    <div className="absolute inset-0 bg-[#050505] z-50 overflow-y-auto custom-scrollbar flex flex-col selection:bg-blue-500 selection:text-white">
      
      {/* HEADER */}
      <section className="min-h-[40vh] md:min-h-[50vh] flex flex-col justify-center px-6 md:px-20 border-b border-white/5 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <div className="px-2 py-0.5 md:px-3 md:py-1 bg-blue-600 text-white text-[8px] md:text-[10px] font-black tracking-[.3em] uppercase rounded-sm animate-pulse">
            Demo Version
          </div>
          <div className="h-[1px] w-12 md:w-20 bg-white/20"></div>
        </div>
        
        <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-black leading-[0.9] md:leading-[0.8] tracking-tighter uppercase italic">
          TEAM<br />
          <span className="text-blue-600">ACCOUNTMAP</span>
        </h1>
      </section>

      {/* THE ARCHITECTS GRID */}
      <section className="p-6 md:p-20 bg-black">
        <h2 className="text-blue-500 font-black text-[10px] md:text-xs uppercase tracking-[0.5em] flex items-center gap-4 mb-10 md:mb-16">
          <SeriousIcons.Sparkle className="w-4 h-4" /> Nice to meet you! 
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-16 md:gap-y-24">
          {architects.map((person, idx) => (
            <div 
              key={idx} 
              className={`group border-t pt-6 md:pt-8 transition-all duration-500 ${
                person.isLead ? 'border-yellow-500 shadow-[0_-20px_50px_-20px_rgba(250,204,21,0.2)]' : 'border-blue-600/30 hover:border-blue-500'
              }`}
            >
              <p className={`${person.isLead ? 'text-yellow-400 font-black' : 'text-blue-500'} font-mono text-[9px] md:text-[10px] mb-2 tracking-[0.3em] uppercase`}>
                [{person.role}]
              </p>
              
              {/* Animation removed from name per request */}
              <h3 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter transition-colors mb-3 md:mb-4 ${person.isLead ? 'text-yellow-500' : 'text-white group-hover:text-blue-400'}`}>
                {person.name}
              </h3>
              
              <p className="text-slate-300 text-sm leading-relaxed max-w-sm mb-8 md:mb-10 font-medium">
                {person.bio}
              </p>

              {/* DYNAMIC CONTACTS GRID - High Contrast Electric Blue */}
              <div className="flex flex-col gap-2 md:gap-3 mb-8 md:mb-10">
                {(person.socials.website || person.socials.github) && (
                  <div className="flex flex-wrap gap-2">
                    {person.socials.website && (
                      <a href={person.socials.website} target="_blank" rel="noreferrer" className={`flex-1 min-w-[120px] text-center py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-sm border ${
                        person.isLead ? 'border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/20' : 'border-blue-500/30 text-blue-400 bg-blue-500/5 hover:bg-blue-500/20 hover:text-white hover:border-blue-500'
                      }`}>
                        Portfolio
                      </a>
                    )}
                    {person.socials.github && (
                      <a href={person.socials.github} target="_blank" rel="noreferrer" className={`flex-1 min-w-[120px] text-center py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-sm border ${
                        person.isLead ? 'border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/20' : 'border-blue-500/30 text-blue-400 bg-blue-500/5 hover:bg-blue-500/20 hover:text-white hover:border-blue-500'
                      }`}>
                        GitHub
                      </a>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  {person.socials.linkedin && (
                    <a href={person.socials.linkedin} target="_blank" rel="noreferrer" className={`flex-1 text-center py-3 text-[9px] font-black transition-all rounded-sm border uppercase tracking-widest ${
                      person.isLead ? 'border-yellow-500/20 text-yellow-600 hover:text-yellow-400' : 'border-blue-500/20 text-blue-500 hover:text-blue-300 hover:border-blue-500/50'
                    }`}>
                      LinkedIn
                    </a>
                  )}
                  {person.socials.discord && (
                    <div className="group/disc flex-1 relative">
                      <button className={`w-full text-center py-3 text-[9px] font-black transition-all rounded-sm border uppercase tracking-widest ${
                        person.isLead ? 'border-yellow-500/20 text-yellow-600 hover:text-yellow-400' : 'border-blue-500/20 text-blue-500 hover:text-blue-300 hover:border-blue-500/50'
                      }`}>
                        Discord
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/disc:opacity-100 transition-all bg-blue-600 text-white text-[9px] px-2 py-1 font-mono rounded pointer-events-none shadow-xl z-20 whitespace-nowrap">
                        {person.socials.discord}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {person.tags.map(tag => (
                  <span key={tag} className={`text-[7px] md:text-[8px] px-2 py-1 border uppercase font-black tracking-widest ${
                    person.isLead ? 'border-yellow-500/20 text-yellow-500/40' : 'border-blue-500/20 text-blue-400/50'
                  }`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* SYSTEM CONSOLE */}
          <div className="xl:col-span-1 bg-[#070707] border border-blue-500/20 rounded-lg p-5 font-mono text-[10px] h-[300px] flex flex-col shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/40" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                <div className="w-2 h-2 rounded-full bg-green-500/40" />
              </div>
              <span className="text-blue-500/50 uppercase tracking-[0.2em] text-[7px]">sys_log.io</span>
            </div>
            
            <div className="flex-1 space-y-2 text-blue-400/80 overflow-hidden">
              {logs.map((log, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-left-4 duration-500 truncate">
                  <span className="text-white/10 select-none mr-2">{i}</span>
                  {log}
                </div>
              ))}
              <div className="w-2 h-3 bg-blue-600 animate-pulse inline-block align-middle ml-1"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-40 md:h-32 w-full" />

      {/* FOOTER */}
      <footer className="sticky bottom-0 w-full mt-auto z-[60]">
        <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]" />
        <div className="relative px-6 py-4 md:px-8 md:py-5 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-3 opacity-30">
               <SeriousIcons.TwoD className="w-3.5 h-3.5" />
               <SeriousIcons.ThreeD className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-600 text-[8px] md:text-[9px] font-black uppercase tracking-[.3em] md:tracking-[.4em] border-l border-white/10 pl-4">
              Make-It-Wright 2026
            </span>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[.2em]">
              © {new Date().getFullYear()} AccountMap
            </p>
            <p className="text-[7px] md:text-[8px] text-blue-500/40 font-mono uppercase tracking-tighter">
              Authorized Demo State
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;