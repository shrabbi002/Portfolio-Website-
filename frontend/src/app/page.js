'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Reveal from '@/components/shared/Reveal';
import Terminal from '@/components/shared/Terminal';

export default function HomePage() {
  const [hero, setHero] = useState(() => api.getCached('/hero'));
  const [skills, setSkills] = useState(() => api.getCached('/skills') || []);
  const [projects, setProjects] = useState(() => api.getCached('/projects') || []);
  const [about, setAbout] = useState(() => api.getCached('/about'));
  const [experience, setExperience] = useState(() => api.getCached('/experience') || []);
  const [publications, setPublications] = useState(() => api.getCached('/publications') || []);
  const [blog, setBlog] = useState(() => api.getCached('/blog') || []);
  const [certs, setCerts] = useState(() => api.getCached('/certifications') || []);
  const [contact, setContact] = useState(() => api.getCached('/contact'));
  const [loading, setLoading] = useState(() => !api.getCached('/hero'));

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [h, s, p, a, e, pub, b, c, ct] = await Promise.all([
          api.get('/hero').catch(() => null),
          api.get('/skills').catch(() => []),
          api.get('/projects').catch(() => []),
          api.get('/about').catch(() => null),
          api.get('/experience').catch(() => []),
          api.get('/publications').catch(() => []),
          api.get('/blog').catch(() => []),
          api.get('/certifications').catch(() => []),
          api.get('/contact').catch(() => null),
        ]);
        setHero(h); setSkills(s); setProjects(p); setAbout(a);
        setExperience(e); setPublications(pub); setBlog(b); setCerts(c); setContact(ct);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading && !hero) return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="overflow-hidden bg-dark-900">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center bg-hero-gradient">
        {/* Ambient background particles with morph animation */}
        <div className="floating-shape top-20 right-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-morph pointer-events-none" />
        <div className="floating-shape bottom-20 left-10 w-56 h-56 bg-accent-cyan/10 rounded-full blur-3xl animate-morph pointer-events-none" style={{ animationDelay: '-6s', animationDuration: '16s' }} />
        <svg className="floating-shape top-32 right-1/3 w-8 h-8 text-primary-400 animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L22 12L12 22L2 12Z" />
        </svg>
        <svg className="floating-shape top-1/2 right-20 w-6 h-6 text-white/20 animate-float-delayed" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="3" />
        </svg>
        <svg className="floating-shape bottom-1/3 left-1/4 w-10 h-10 text-accent-cyan/30 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>

        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24 pb-12">
            <div className="animate-fadeInLeft">
              <p className="text-primary-400 font-extrabold uppercase tracking-widest text-xs mb-4">
                Welcome to my Portfolio
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-black leading-[1.1] mb-6">
                {hero?.headline || 'Build Your Awesome Platform'}
              </h1>
              <p className="text-base sm:text-lg text-primary-300 font-bold uppercase tracking-wider mb-6">
                {hero?.subtitle || 'Software QA Engineer | System Analyst | Data Analyst | Researcher'}
              </p>
              <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                {hero?.introduction || 'SQA Engineer with 2+ years of experience in software quality assurance, requirement analysis, and system testing. Actively involved in AI research and development (R&D), focusing on building reliable, data-driven, and high-quality software solutions.'}
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/projects" className="btn-primary hover-lift shimmer-effect text-sm font-semibold uppercase tracking-wider py-3.5 px-6">
                  View Projects
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
                <Link href="/contact" className="btn-outline hover-lift text-sm font-semibold uppercase tracking-wider py-3.5 px-6 bg-dark-900/40">
                  Contact Me
                </Link>
                <a href={hero?.cvFile ? api.getFileUrl(hero.cvFile) : '/cv.pdf'} download="CV.pdf" className="btn-outline hover-lift text-sm font-semibold uppercase tracking-wider py-3.5 px-6 bg-dark-900/40">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M12 5v14M12 19l-5-5M12 19l5-5" />
                    <path d="M5 21h14" />
                  </svg>
                  Download CV
                </a>
              </div>

              {hero?.highlights?.length > 0 && (
                <div className="flex flex-wrap gap-6">
                  {hero.highlights.map((h, i) => (
                    <div key={i} className="glass-card px-5 py-3 hover-lift border border-white/5 cursor-default">
                      <p className="text-3xl font-heading font-black gradient-text tracking-tight">{h.number}</p>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-1">{h.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative animate-fadeInRight">
              <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[340px] lg:max-w-[400px] mx-auto group">
                {/* Outer rotating gradient ring */}
                <div className="absolute -inset-3 rounded-[2rem] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'conic-gradient(from 0deg, #6c5ce7, #00d4ff, #ff6b9d, #6c5ce7)',
                    animation: 'spin 8s linear infinite',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    padding: '3px',
                  }} />

                {/* Inner glow ring */}
                <div className="absolute -inset-1 rounded-[1.8rem] bg-gradient-to-br from-primary-500/20 via-transparent to-accent-cyan/20 animate-borderGlow" />

                {/* Tilted background frames */}
                <div className="absolute inset-3 rounded-3xl border border-primary-500/20 rotate-3 group-hover:rotate-6 transition-transform duration-700" />
                <div className="absolute inset-2 rounded-3xl border border-accent-cyan/10 -rotate-2 group-hover:-rotate-5 transition-transform duration-700" />

                {/* Main photo with vibrate on hover */}
                <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden group-hover:animate-vibrate">
                  {hero?.profileImage ? (
                    <img src={api.getFileUrl(hero.profileImage)} alt="Profile"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <img src="/profile.png" alt="MD Sakhawat Hossain Rabbi"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Orbiting dots */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="animate-orbit">
                    <div className="w-3 h-3 rounded-full bg-primary-500 shadow-lg shadow-primary-500/50" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="animate-orbit-reverse">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-lg shadow-accent-cyan/50" />
                  </div>
                </div>

                {/* Corner accents */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-primary-400/50 rounded-tl-xl animate-borderGlow" />
                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-accent-cyan/50 rounded-tr-xl animate-borderGlow" style={{ animationDelay: '0.5s' }} />
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-accent-cyan/50 rounded-bl-xl animate-borderGlow" style={{ animationDelay: '1s' }} />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-primary-400/50 rounded-br-xl animate-borderGlow" style={{ animationDelay: '1.5s' }} />

                {/* Floating decorative elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 border-2 border-primary-400/30 rounded-full animate-pulse-slow" />
                <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-primary-500/10 rounded-2xl rotate-12 animate-float" />
                <div className="absolute top-1/2 -right-10 w-4 h-4 bg-accent-cyan/40 rounded-full animate-float-delayed" />
              </div>
              <div className="mt-10">
                <Terminal />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />
      </section>

      {/* ═══ ABOUT GLANCE ═══ */}
      <section className="section-padding bg-dark-900 border-t border-white/5">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <Reveal direction="left" className="lg:col-span-2">
              {about?.image ? (
                <div className="relative group overflow-hidden rounded-3xl border border-white/10 hover:border-primary-500/30 transition-all duration-300">
                  <img src={api.getFileUrl(about.image)} alt="About" className="w-full object-cover h-80 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ) : (
                <div className="rounded-3xl bg-dark-800/50 h-80 flex items-center justify-center border border-white/5 hover:border-primary-500/20 transition-all">
                  <span className="text-8xl opacity-20 hover:scale-110 transition-transform duration-300">🧑‍💼</span>
                </div>
              )}
            </Reveal>
            <Reveal direction="right" className="lg:col-span-3">
              <p className="text-primary-400 font-bold uppercase tracking-wider text-xs mb-2">About Me</p>
              <h2 className="section-title mb-4">Who I Am</h2>
              <p className="text-white/60 leading-relaxed mb-6 text-sm sm:text-base">
                {about?.biography || 'SQA Engineer with 2+ years of experience in software quality assurance, requirement analysis, and system testing. Actively involved in AI research and development (R&D), focusing on building reliable, data-driven, and high-quality software solutions.'}
              </p>
              {about?.expertise?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {about.expertise.map((e, i) => (
                    <span key={i} className="px-3.5 py-1.5 glass-card-hover text-primary-300 text-xs font-semibold uppercase tracking-wider cursor-default">{e}</span>
                  ))}
                </div>
              )}

              {/* Highlighted Education Section */}
              {about?.education && Array.isArray(about.education) && about.education.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/5">
                  <h3 className="text-xs font-heading font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-accent-pink" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M22.25 9.312 12.117 19.445a.75.75 0 0 1-1.06 0L1 9.312" />
                    </svg>
                    Education / Academic Background
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {about.education.map((edu, idx) => (
                      <div key={idx} className="glass-card-hover p-4 relative overflow-hidden group">
                        {/* Soft border accent */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent-pink to-primary-500 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <h4 className="font-heading font-bold text-white text-sm leading-snug group-hover:text-primary-400 transition-colors duration-300">{edu.degree}</h4>
                        <p className="text-primary-300 text-xs mt-1 font-semibold leading-normal">{edu.institution}</p>
                        <p className="text-white/40 text-[10px] font-bold mt-1.5 uppercase tracking-wider">{edu.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ SKILLS OVERVIEW ═══ */}
      {skills.length > 0 && (() => {
        const categoryThemes = [
          { gradient: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/20', ring: '#a855f7', bg: 'bg-violet-500/10', text: 'text-violet-300', dot: 'bg-violet-400', border: 'border-violet-500/20' },
          { gradient: 'from-cyan-500 to-teal-500', glow: 'shadow-cyan-500/20', ring: '#06b6d4', bg: 'bg-cyan-500/10', text: 'text-cyan-300', dot: 'bg-cyan-400', border: 'border-cyan-500/20' },
          { gradient: 'from-rose-500 to-pink-500', glow: 'shadow-rose-500/20', ring: '#f43f5e', bg: 'bg-rose-500/10', text: 'text-rose-300', dot: 'bg-rose-400', border: 'border-rose-500/20' },
          { gradient: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/20', ring: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-300', dot: 'bg-amber-400', border: 'border-amber-500/20' },
          { gradient: 'from-emerald-500 to-green-500', glow: 'shadow-emerald-500/20', ring: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-300', dot: 'bg-emerald-400', border: 'border-emerald-500/20' },
          { gradient: 'from-blue-500 to-indigo-500', glow: 'shadow-blue-500/20', ring: '#3b82f6', bg: 'bg-blue-500/10', text: 'text-blue-300', dot: 'bg-blue-400', border: 'border-blue-500/20' },
        ];
        const totalSkills = skills.reduce((acc, s) => acc + (s.skills?.length || 0), 0);

        return (
        <section className="section-padding bg-dark-800/30 relative overflow-hidden border-t border-white/5">
          {/* Background decorations */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary-500/5 via-violet-500/3 to-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-10 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl pointer-events-none animate-float" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none animate-float-delayed" />

          <div className="section-container relative">
            <Reveal direction="up" className="text-center mb-16">
              <p className="text-primary-400 font-bold uppercase tracking-wider text-xs mb-2">Expertise</p>
              <h2 className="section-title">Skills & Technologies</h2>
              <p className="section-subtitle mx-auto mb-8">A snapshot of my technical competencies</p>

              {/* Stats bar */}
              <div className="inline-flex items-center gap-8 glass-card px-8 py-4">
                <div className="text-center">
                  <p className="text-2xl font-heading font-black gradient-text">{skills.length}</p>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Domains</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-heading font-black text-accent-cyan">{totalSkills}</p>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Skills</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-heading font-black text-emerald-400">
                    {totalSkills > 0 ? Math.round(skills.reduce((acc, s) => acc + (s.skills?.reduce((a, sk) => a + sk.proficiency, 0) || 0), 0) / totalSkills) : 0}%
                  </p>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Avg Level</p>
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {skills.map((cat, i) => {
                const theme = categoryThemes[i % categoryThemes.length];
                const avgProf = cat.skills?.length > 0
                  ? Math.round(cat.skills.reduce((a, s) => a + s.proficiency, 0) / cat.skills.length)
                  : 0;
                const circumference = 2 * Math.PI * 38;
                const strokeDashoffset = circumference - (circumference * avgProf) / 100;

                return (
                  <Reveal key={cat._id || i} direction="up" delay={i * 0.1} duration={0.6}>
                    <div className={`group relative overflow-hidden rounded-2xl border ${theme.border} bg-dark-900/60 backdrop-blur-sm hover:shadow-2xl ${theme.glow} transition-all duration-500 hover:-translate-y-1.5 h-full`}>
                      {/* Top gradient accent */}
                      <div className={`h-1 w-full bg-gradient-to-r ${theme.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

                      {/* Header with radial progress */}
                      <div className="p-6 pb-4 flex items-center gap-5">
                        {/* Radial Progress Ring */}
                        <div className="relative flex-shrink-0">
                          <svg className="w-20 h-20 -rotate-90 drop-shadow-lg" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="38" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
                            <circle cx="40" cy="40" r="38" fill="none" stroke={theme.ring} strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              className="transition-all duration-1000 ease-out group-hover:drop-shadow-[0_0_6px_currentColor]"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <span className={`text-lg font-heading font-black bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>{avgProf}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading font-bold text-white text-base sm:text-lg group-hover:text-white transition-colors truncate">{cat.category}</h3>
                          <p className="text-white/30 text-xs mt-0.5">{cat.skills?.length || 0} skills</p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-3xl group-hover:scale-125 transition-transform duration-300 inline-block">{cat.icon || '⚡'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Skills with animated bars */}
                      <div className="px-6 pb-5 space-y-3">
                        {cat.skills?.map((s, j) => (
                          <div key={j} className="group/skill">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${theme.dot} group-hover/skill:scale-[2] transition-transform duration-300`} />
                                <span className="text-white/60 text-xs font-medium group-hover/skill:text-white transition-colors duration-300">{s.name}</span>
                              </div>
                              <span className={`text-[10px] font-bold ${theme.text} opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300`}>{s.proficiency}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${theme.gradient} opacity-60 group-hover/skill:opacity-100 transition-all duration-700`}
                                style={{ width: `${s.proficiency}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Hover glow */}
                      <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl ${theme.gradient} rounded-full opacity-0 group-hover:opacity-[0.04] blur-3xl transition-opacity duration-700 pointer-events-none`} />
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* View all link */}
            <Reveal direction="up" className="text-center mt-12">
              <Link href="/skills"
                className="inline-flex items-center gap-3 glass-card px-8 py-3.5 text-primary-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 group hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-0.5">
                <span>View all skills & proficiency levels</span>
                <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </Reveal>
          </div>
        </section>
        );
      })()}

      {/* ═══ FEATURED PROJECTS ═══ */}
      {projects.length > 0 && (() => {
        const projectThemes = [
          { bg: 'from-[#1a1040] via-[#2d1b69] to-[#1a1040]', border: 'border-purple-500/15 hover:border-purple-400/30', glow: 'shadow-purple-500/10', accent: '#a855f7', accentGradient: 'from-purple-500 to-violet-600' },
          { bg: 'from-[#0d2137] via-[#0e3a5e] to-[#0d2137]', border: 'border-sky-500/15 hover:border-sky-400/30', glow: 'shadow-sky-500/10', accent: '#38bdf8', accentGradient: 'from-sky-500 to-cyan-500' },
          { bg: 'from-[#1a0f0f] via-[#3b1520] to-[#1a0f0f]', border: 'border-rose-500/15 hover:border-rose-400/30', glow: 'shadow-rose-500/10', accent: '#fb7185', accentGradient: 'from-rose-500 to-pink-500' },
          { bg: 'from-[#0a1f1a] via-[#0f3d2e] to-[#0a1f1a]', border: 'border-emerald-500/15 hover:border-emerald-400/30', glow: 'shadow-emerald-500/10', accent: '#34d399', accentGradient: 'from-emerald-500 to-teal-500' },
          { bg: 'from-[#1f1505] via-[#3d2a0a] to-[#1f1505]', border: 'border-amber-500/15 hover:border-amber-400/30', glow: 'shadow-amber-500/10', accent: '#fbbf24', accentGradient: 'from-amber-500 to-orange-500' },
          { bg: 'from-[#0f1535] via-[#1e2a6e] to-[#0f1535]', border: 'border-blue-500/15 hover:border-blue-400/30', glow: 'shadow-blue-500/10', accent: '#60a5fa', accentGradient: 'from-blue-500 to-indigo-500' },
        ];
        const svgIcons = [
          <svg key="code" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg>,
          <svg key="globe" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582" /></svg>,
          <svg key="cpu" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" /></svg>,
          <svg key="chart" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>,
          <svg key="rocket" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>,
          <svg key="stack" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0 4.179 2.25L12 17.25 2.25 12l4.179-2.25" /></svg>,
        ];

        return (
        <section className="section-padding bg-dark-900 relative overflow-hidden border-t border-white/5">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

          <div className="section-container relative">
            <Reveal direction="up" className="text-center mb-16">
              <p className="text-primary-400 font-bold uppercase tracking-wider text-xs mb-2">Portfolio</p>
              <h2 className="section-title">Featured Projects</h2>
              <p className="section-subtitle mx-auto mb-8">Recent work and implementations</p>

              {/* Stats */}
              <div className="inline-flex items-center gap-8 glass-card px-8 py-4">
                <div className="text-center">
                  <p className="text-2xl font-heading font-black gradient-text">{projects.length}</p>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Projects</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-heading font-black text-accent-cyan">{new Set(projects.flatMap(p => p.technologies || [])).size}</p>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Technologies</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-heading font-black text-amber-400">{new Set(projects.map(p => p.category).filter(Boolean)).size}</p>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Domains</p>
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.slice(0, 6).map((project, i) => {
                const theme = projectThemes[i % projectThemes.length];

                return (
                  <Reveal key={project._id || i} direction="up" delay={(i % 3) * 0.1} duration={0.6}>
                    <div className={`group relative overflow-hidden rounded-2xl border ${theme.border} bg-dark-800/40 backdrop-blur-sm hover:shadow-2xl ${theme.glow} transition-all duration-500 hover:-translate-y-2 h-full flex flex-col`}>
                      {/* Header area with gradient */}
                      <div className={`relative h-48 bg-gradient-to-br ${theme.bg} overflow-hidden border-b border-white/5`}>
                        {project.screenshots?.[0] ? (
                          <img src={api.getFileUrl(project.screenshots[0])} alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center relative">
                            {/* Decorative shapes */}
                            <div className="absolute top-6 right-8 w-14 h-14 border border-white/[0.04] rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-700" />
                            <div className="absolute bottom-8 left-6 w-10 h-10 border border-white/[0.04] rounded-full group-hover:scale-150 transition-transform duration-700" />
                            <div className="absolute top-10 left-12 w-3 h-3 bg-white/[0.03] rounded-full" />

                            <div className="relative group-hover:scale-110 transition-transform duration-500" style={{ color: theme.accent }}>
                              {svgIcons[i % svgIcons.length]}
                            </div>
                            <span className="text-white/10 text-[10px] font-black uppercase tracking-[0.2em] mt-3">{project.category}</span>
                          </div>
                        )}

                        {/* Category badge */}
                        <div className="absolute top-3 right-3 z-10">
                          <span className="px-3 py-1 bg-dark-900/60 backdrop-blur-md text-white/80 text-[10px] font-black uppercase tracking-wider rounded-full border border-white/10">
                            {project.category}
                          </span>
                        </div>

                        {/* Featured badge */}
                        {project.featured && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/90 text-dark-900 text-[10px] font-black uppercase tracking-wider rounded-full">
                              ⭐ Featured
                            </span>
                          </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-4 gap-3 z-10">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider hover:bg-white/20 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                              Code
                            </a>
                          )}
                          {project.demoUrl && (
                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-500/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider hover:bg-primary-500 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Content area */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-heading font-bold text-base sm:text-lg mb-2 text-white group-hover:text-primary-400 transition-colors duration-300 leading-snug">
                            {project.name}
                          </h3>

                          {project.role && (
                            <p className="text-primary-300 text-[10px] font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                              {project.role}
                            </p>
                          )}

                          <p className="text-white/50 text-xs sm:text-sm mb-5 leading-relaxed line-clamp-3">{project.description}</p>
                        </div>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {project.technologies?.slice(0, 4).map((tech, j) => (
                            <span key={j} className="px-2.5 py-1 bg-white/[0.03] border border-white/[0.06] text-white/50 text-[10px] font-semibold uppercase tracking-wider rounded-lg hover:bg-white/[0.08] hover:text-white/80 transition-colors cursor-default">
                              {tech}
                            </span>
                          ))}
                          {(project.technologies?.length || 0) > 4 && (
                            <span className="px-2.5 py-1 text-primary-400/60 text-[10px] font-bold">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom accent */}
                      <div className={`h-0.5 bg-gradient-to-r ${theme.accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal direction="up" className="text-center mt-12">
              <Link href="/projects"
                className="inline-flex items-center gap-3 glass-card px-8 py-3.5 text-primary-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 group hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-0.5">
                <span>Explore All Projects</span>
                <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </Reveal>
          </div>
        </section>
        );
      })()}

      {/* ═══ EXPERIENCE GLANCE ═══ */}
      {experience.length > 0 && (() => {
        const getOrgIcon = (org) => {
            if (org.includes('Army')) return '🎖️';
            if (org.includes('Hospital') || org.includes('Medical')) return '🏥';
            if (org.includes('Pharmik') || org.includes('Laboratories') || org.includes('Drug')) return '🧪';
            if (org.includes('LAANTECH')) return '🤖';
            return '💼';
        };

        return (
        <section className="section-padding bg-dark-800/30 border-t border-white/5 relative overflow-hidden">
          {/* Ambient background glows */}
          <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

          <div className="section-container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Sticky Info Panel */}
              <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
                <Reveal direction="left">
                  <p className="text-primary-400 font-bold uppercase tracking-wider text-xs mb-2">Career</p>
                  <h2 className="section-title mb-4">Professional Experience</h2>
                  <p className="text-white/50 leading-relaxed text-sm sm:text-base mb-6">
                    A summary of my journey across software QA engineering, requirements analysis, and system testing roles.
                  </p>
                  
                  {/* Career timeline button */}
                  <Link href="/experience"
                    className="inline-flex items-center gap-3 glass-card px-6 py-3 text-primary-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 group hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-0.5">
                    <span>Full Career Timeline</span>
                    <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </Reveal>
              </div>

              {/* Vertical timeline columns */}
              <div className="lg:col-span-8 space-y-8 relative pl-6 border-l border-white/10 ml-2 sm:ml-4 lg:ml-0">
                {/* Glowing vertical line overlay */}
                <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-primary-500 via-accent-cyan to-accent-pink/30 pointer-events-none" />

                {experience.slice(0, 3).map((exp, i) => {
                  const orgIcon = getOrgIcon(exp.organization);

                  return (
                    <Reveal key={exp._id || i} direction="up" delay={i * 0.1} duration={0.6}>
                      <div className="relative group pl-8">
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1.5 -translate-x-1/2 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-dark-900 border-2 border-primary-500 group-hover:border-accent-cyan transition-colors" />
                          <div className="absolute w-5 h-5 rounded-full bg-primary-500/10 animate-ping opacity-0 group-hover:opacity-100 pointer-events-none" />
                        </div>

                        {/* Card content */}
                        <div className="glass-card-hover p-6 relative overflow-hidden">
                          {/* Top accent bar */}
                          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary-500 to-accent-cyan opacity-40 group-hover:opacity-100 transition-opacity" />

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                                {orgIcon}
                              </div>
                              <div>
                                <h3 className="font-heading font-bold text-white text-base sm:text-lg group-hover:text-primary-400 transition-colors leading-snug">
                                  {exp.role}
                                </h3>
                                <p className="text-primary-300 font-bold text-xs tracking-wider uppercase">{exp.organization}</p>
                              </div>
                            </div>

                            <span className="inline-flex items-center px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-300 text-[10px] font-black uppercase tracking-wider rounded-full self-start sm:self-center">
                              {exp.startDate} – {exp.endDate}
                            </span>
                          </div>

                          {/* Responsibilities snippet */}
                          {exp.responsibilities?.length > 0 && (
                            <ul className="space-y-1.5">
                              {exp.responsibilities.slice(0, 2).map((r, j) => (
                                <li key={j} className="text-white/50 text-xs sm:text-sm flex items-start gap-2 leading-relaxed">
                                  <svg className="w-3.5 h-3.5 text-primary-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                  </svg>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        );
      })()}

      {/* ═══ RESEARCH GLANCE ═══ */}
      {publications.length > 0 && (
        <section className="section-padding bg-dark-900 border-t border-white/5">
          <div className="section-container">
            <Reveal direction="up" className="text-center mb-16">
              <p className="text-primary-400 font-bold uppercase tracking-wider text-xs mb-2">Academic</p>
              <h2 className="section-title">Research & Publications</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publications.map((pub, i) => (
                <Reveal key={pub._id || i} direction="up" delay={i * 0.08} duration={0.6}>
                  <div className="glass-card-hover p-6 flex gap-4 h-full">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${pub.type === 'journal' ? 'bg-primary-500/10 border border-primary-500/20' :
                      pub.type === 'conference' ? 'bg-accent-cyan/10 border border-accent-cyan/20' :
                        'bg-accent-pink/10 border border-accent-pink/20'
                      }`}>
                      {pub.type === 'journal' ? '📄' : pub.type === 'conference' ? '🎤' : '🔬'}
                    </div>
                    <div className="min-w-0">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${pub.type === 'journal' ? 'text-primary-300' :
                        pub.type === 'conference' ? 'text-accent-cyan' :
                          'text-accent-pink'
                        }`}>{pub.type} · {pub.year}</span>
                      <h3 className="font-heading font-bold text-sm mt-1 text-white leading-snug">{pub.title}</h3>
                      {pub.journal && <p className="text-white/40 text-xs mt-1.5 leading-normal">{pub.journal}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ BLOG GLANCE ═══ */}
      {blog.length > 0 && (
        <section className="section-padding bg-dark-800/30 border-t border-white/5">
          <div className="section-container">
            <Reveal direction="up" className="text-center mb-16">
              <p className="text-primary-400 font-bold uppercase tracking-wider text-xs mb-2">Insights</p>
              <h2 className="section-title">Latest Blog Posts</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blog.slice(0, 3).map((post, i) => (
                <Reveal key={post._id || i} direction="up" delay={i * 0.08} duration={0.6}>
                  <Link href={`/blog/${post.slug}`} className="glass-card-hover overflow-hidden group block h-full flex flex-col justify-between">
                    <div className="h-40 bg-gradient-to-br from-primary-500/20 to-dark-700 relative overflow-hidden border-b border-white/5">
                      {post.featuredImage ? (
                        <img src={api.getFileUrl(post.featuredImage)} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">📝</div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <h3 className="font-heading font-bold text-sm sm:text-base mb-2 text-white group-hover:text-primary-400 transition-colors leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-white/50 text-xs sm:text-sm line-clamp-2 leading-normal">{post.excerpt || post.content?.substring(0, 100)}</p>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CERTIFICATIONS GLANCE ═══ */}
      {certs.length > 0 && (() => {
        const certThemes = {
          certification: { gradient: 'from-violet-500 to-purple-600', ring: '#a855f7', bg: 'bg-violet-500/10', border: 'border-violet-500/20 hover:border-violet-400/40', glow: 'shadow-violet-500/10', icon: '🎓' },
          award: { gradient: 'from-amber-500 to-orange-500', ring: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/20 hover:border-amber-400/40', glow: 'shadow-amber-500/10', icon: '🏆' },
          competition: { gradient: 'from-cyan-500 to-teal-500', ring: '#06b6d4', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20 hover:border-cyan-400/40', glow: 'shadow-cyan-500/10', icon: '🥇' },
        };
        const defaultTheme = certThemes.certification;

        return (
        <section className="section-padding bg-dark-900 relative overflow-hidden border-t border-white/5">
          {/* Background decorations */}
          <div className="absolute top-1/4 right-0 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-0 w-56 h-56 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="section-container relative">
            <Reveal direction="up" className="text-center mb-16">
              <p className="text-primary-400 font-bold uppercase tracking-wider text-xs mb-2">Credentials</p>
              <h2 className="section-title">Certifications & Achievements</h2>
              <p className="section-subtitle mx-auto mb-8">Professional credentials and recognition</p>

              {/* Stats */}
              <div className="inline-flex items-center gap-8 glass-card px-8 py-4">
                <div className="text-center">
                  <p className="text-2xl font-heading font-black gradient-text">{certs.length}</p>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Total</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-heading font-black text-violet-400">{certs.filter(c => c.type === 'certification').length}</p>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Certifications</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-heading font-black text-amber-400">{certs.filter(c => c.type === 'award').length}</p>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Awards</p>
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {certs.map((cert, i) => {
                const theme = certThemes[cert.type] || defaultTheme;
                return (
                  <Reveal key={cert._id || i} direction="up" delay={i * 0.08} duration={0.6}>
                    <div className={`group relative overflow-hidden rounded-2xl border ${theme.border} bg-dark-800/40 backdrop-blur-sm hover:shadow-2xl ${theme.glow} transition-all duration-500 hover:-translate-y-1.5 h-full flex flex-col`}>
                      {/* Top accent */}
                      <div className={`h-1 bg-gradient-to-r ${theme.gradient} opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />

                      <div className="p-5 flex-1 flex flex-col items-center text-center">
                        {/* Icon with gradient ring */}
                        <div className="relative mb-4">
                          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                            <circle cx="32" cy="32" r="29" fill="none" stroke={theme.ring} strokeWidth="2.5"
                              strokeLinecap="round" strokeDasharray={2 * Math.PI * 29} strokeDashoffset={0}
                              className="opacity-40 group-hover:opacity-100 transition-opacity duration-700"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{theme.icon}</span>
                          </div>
                        </div>

                        <h3 className="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-primary-400 transition-colors duration-300 mb-2 leading-snug">
                          {cert.title}
                        </h3>

                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">{cert.organization}</p>
                        {cert.year && (
                          <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${theme.bg} border ${theme.border.split(' ')[0]}`} style={{ color: theme.ring }}>
                            {cert.year}
                          </span>
                        )}

                        {/* Certificate link */}
                        <div className="flex items-center gap-4 mt-3">
                          {cert.certificateImage && (
                            <a href={api.getFileUrl(cert.certificateImage)} target="_blank" rel="noopener noreferrer"
                              className="text-primary-400 text-[10px] font-bold uppercase tracking-wider hover:text-primary-300 transition-colors flex items-center gap-1 group/img">
                              View Certificate
                              <svg className="w-3.5 h-3.5 group-hover/img:translate-x-0.5 group-hover/img:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                            </a>
                          )}
                          {cert.certificateUrl && (
                            <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer"
                              className="text-accent-cyan text-[10px] font-bold uppercase tracking-wider hover:text-cyan-300 transition-colors flex items-center gap-1 group/link">
                              Verify Online
                              <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Hover glow */}
                      <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-tl ${theme.gradient} rounded-full opacity-0 group-hover:opacity-[0.04] blur-3xl transition-opacity duration-700 pointer-events-none`} />
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal direction="up" className="text-center mt-12">
              <Link href="/certifications"
                className="inline-flex items-center gap-3 glass-card px-8 py-3.5 text-primary-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 group hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-0.5">
                <span>View All Certifications</span>
                <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </Reveal>
          </div>
        </section>
        );
      })()}

      {/* ═══ CONTACT CTA ═══ */}
      <section className="section-padding relative overflow-hidden border-t border-white/5 bg-gradient-to-br from-dark-900 to-dark-950">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-transparent to-accent-cyan/15 pointer-events-none" />
        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal direction="left">
              <p className="text-primary-400 font-bold uppercase tracking-wider text-xs mb-2">Get in Touch</p>
              <h2 className="section-title mb-4">Let&apos;s Work Together</h2>
              <p className="text-white/60 leading-relaxed mb-8 text-sm sm:text-base">
                Interested in collaboration, research partnerships, or just want to connect? I&apos;d love to hear from you.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary hover-lift shimmer-effect text-xs font-bold uppercase tracking-wider py-3.5 px-6">
                  Get In Touch
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/projects" className="btn-outline hover-lift text-xs font-bold uppercase tracking-wider py-3.5 px-6 bg-dark-900/40">
                  Explore Projects
                </Link>
              </div>
            </Reveal>
            <Reveal direction="right" className="space-y-4">
              {contact?.email && (
                <div className="glass-card-hover p-4 flex items-center gap-4 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0 text-primary-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-wider">Email Address</p>
                    <a href={`mailto:${contact.email}`} className="text-white/70 hover:text-primary-400 transition-colors text-xs sm:text-sm font-semibold truncate block">{contact.email}</a>
                  </div>
                </div>
              )}
              {contact?.linkedin && (
                <div className="glass-card-hover p-4 flex items-center gap-4 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center flex-shrink-0 text-[#0A66C2]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-wider">LinkedIn</p>
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary-400 transition-colors text-xs sm:text-sm font-semibold truncate block">MD Sakhawat Hossain Rabbi</a>
                  </div>
                </div>
              )}
              {contact?.github && (
                <div className="glass-card-hover p-4 flex items-center gap-4 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-wider">GitHub</p>
                    <a href={contact.github} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary-400 transition-colors text-xs sm:text-sm font-semibold truncate block">shrabbi002</a>
                  </div>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
