'use client';
import { useState, useEffect, useRef, use, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Reveal from '@/components/shared/Reveal';

/* ─── Default process steps ─── */
const defaultProcessSteps = [
  {
    id: 1, title: 'Research & Discovery',
    description: 'Analyzed requirements, studied the domain, and identified key challenges and user needs.',
    icon: '🔍', color: '#a855f7', gradient: 'from-purple-500 to-violet-600',
  },
  {
    id: 2, title: 'Planning & Architecture',
    description: 'Designed the system architecture, created wireframes, and defined the technology stack.',
    icon: '📐', color: '#38bdf8', gradient: 'from-sky-500 to-cyan-500',
  },
  {
    id: 3, title: 'Development & Implementation',
    description: 'Built the core features iteratively, following best practices and clean code principles.',
    icon: '⚙️', color: '#34d399', gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 4, title: 'Testing & QA',
    description: 'Performed comprehensive testing including unit tests, integration tests, and UAT.',
    icon: '🧪', color: '#fb7185', gradient: 'from-rose-500 to-pink-500',
  },
  {
    id: 5, title: 'Deployment & Launch',
    description: 'Deployed to production, set up CI/CD pipelines, and ensured smooth rollout.',
    icon: '🚀', color: '#fbbf24', gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 6, title: 'Monitoring & Iteration',
    description: 'Continuously monitored performance, gathered feedback, and iterated on improvements.',
    icon: '📊', color: '#60a5fa', gradient: 'from-blue-500 to-indigo-500',
  },
];


/* ─── Python Code Style Project Info ─── */
function PythonCodeBlock({ project }) {
  const [typedLength, setTypedLength] = useState(0);
  const [cursor, setCursor] = useState(true);

  const getPythonCode = useCallback(() => {
    const tech = (project.technologies || []).map(t => `"${t}"`).join(', ');
    const desc = (project.description || '').replace(/"/g, '\\"');
    
    return `class PortfolioProject:
    def __init__(self):
        self.name = "${project.name}"
        self.category = "${project.category || 'Software development'}"
        self.role = "${project.role || 'Lead Engineer'}"
        self.tech_stack = [${tech}]

    def execute(self) -> dict:
        return {
            "status": "Ready",
            "features": len(self.tech_stack),
            "description": "${desc.substring(0, 60)}..."
        }

# Initializing project...
project = PortfolioProject()
print(project.execute())
`;
  }, [project]);

  const code = getPythonCode();

  useEffect(() => {
    setTypedLength(0);
    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength++;
      setTypedLength(currentLength);
      if (currentLength >= code.length) {
        clearInterval(interval);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [code]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const highlightPython = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.trim().startsWith('#')) {
        return (
          <div key={idx} className="whitespace-pre">
            <span className="text-white/20 select-none mr-4 w-4 inline-block text-right">{idx + 1}</span>
            <span className="text-green-500/80">{line}</span>
          </div>
        );
      }

      const parts = [];
      const regex = /(\bclass\b|\bdef\b|\breturn\b|\bself\b|\blen\b|\bprint\b|\b__init__\b|"[^"]*"|#[^\n]*)/g;
      let match;
      let lastIndex = 0;

      while ((match = regex.exec(line)) !== null) {
        const textBefore = line.substring(lastIndex, match.index);
        if (textBefore) parts.push(<span key={lastIndex}>{textBefore}</span>);

        const token = match[0];
        if (token === 'class' || token === 'def' || token === 'return') {
          parts.push(<span key={match.index} className="text-pink-500 font-semibold">{token}</span>);
        } else if (token === 'self') {
          parts.push(<span key={match.index} className="text-orange-400 font-medium">{token}</span>);
        } else if (token === 'len' || token === 'print') {
          parts.push(<span key={match.index} className="text-cyan-400">{token}</span>);
        } else if (token === '__init__') {
          parts.push(<span key={match.index} className="text-blue-400">{token}</span>);
        } else if (token.startsWith('"')) {
          parts.push(<span key={match.index} className="text-amber-300 font-medium">{token}</span>);
        } else if (token.startsWith('#')) {
          parts.push(<span key={match.index} className="text-green-500/80">{token}</span>);
        } else {
          parts.push(<span key={match.index}>{token}</span>);
        }

        lastIndex = regex.lastIndex;
      }

      const textAfter = line.substring(lastIndex);
      if (textAfter) parts.push(<span key={lastIndex}>{textAfter}</span>);

      return (
        <div key={idx} className="whitespace-pre">
          <span className="text-white/20 select-none mr-4 w-4 inline-block text-right">{idx + 1}</span>
          {parts}
        </div>
      );
    });
  };

  const typedText = code.slice(0, typedLength);

  return (
    <div className="font-mono text-[10px] sm:text-[11px] leading-relaxed p-6 bg-[#080812] text-white/90 overflow-x-auto min-h-[300px] h-full flex flex-col border border-white/5 relative">
      <div className="absolute top-2 right-3 text-[8px] text-white/20 font-bold uppercase tracking-wider">
        python 3.10
      </div>
      <div className="flex-1">
        {highlightPython(typedText)}
        {cursor && <span className="w-1.5 h-3.5 bg-primary-400 inline-block ml-0.5 animate-pulse" />}
      </div>
    </div>
  );
}

/* ─── Floating Particles ─── */

function Particles({ count = 20 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 8,
    opacity: 0.15 + Math.random() * 0.3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary-400 project-detail-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Browser Frame Mockup ─── */
function BrowserFrame({ children, url }) {
  return (
    <div className="browser-frame group hover:border-primary-500/30 transition-all duration-700">
      <div className="browser-frame-bar">
        <div className="browser-dot" style={{ background: '#ff5f57' }} />
        <div className="browser-dot" style={{ background: '#ffbd2e' }} />
        <div className="browser-dot" style={{ background: '#28c840' }} />
        <div className="flex-1 mx-3">
          <div className="bg-dark-900/60 rounded-md px-3 py-1 text-[10px] text-white/30 font-mono truncate max-w-xs">
            {url || 'https://project-preview.dev'}
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/* ─── Horizontal Step Card ─── */
function HorizontalStepCard({ step, index, isActive, isVisible, total }) {
  return (
    <div
      className={`relative flex-shrink-0 w-[290px] sm:w-[325px] snap-start transition-all duration-700
        ${isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95'}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`group relative p-6 rounded-2xl border backdrop-blur-sm h-full flex flex-col justify-between transition-all duration-500 ${isActive
        ? 'bg-dark-800/85 border-primary-500/30 shadow-2xl scale-[1.01]'
        : 'bg-dark-800/35 border-white/5 hover:border-white/10 hover:bg-dark-800/50'
        }`}
      >
        {/* Active indicator glow */}
        {isActive && (
          <div className="absolute -inset-px rounded-2xl opacity-20 pointer-events-none"
            style={{ background: `linear-gradient(135deg, ${step.color}30, transparent)` }} />
        )}

        <div>
          {/* Header: Badge & step info */}
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg border border-white/10 transition-all duration-500"
              style={isActive ? {
                background: `linear-gradient(135deg, ${step.color}, ${step.color}88)`,
                borderColor: 'transparent',
                boxShadow: `0 0 20px ${step.color}30`,
              } : {
                backgroundColor: 'rgba(255, 255, 255, 0.03)'
              }}
            >
              {step.icon}
            </div>
            
            <span className="text-[10px] font-black uppercase tracking-widest animate-pulse" style={{ color: step.color }}>
              Step {String(step.id).padStart(2, '0')}
            </span>
          </div>

          {/* Title */}
          <h3 className={`font-heading font-bold text-sm sm:text-base mb-2 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white/80'}`}>
            {step.title}
          </h3>

          {/* Description */}
          <p className={`text-xs leading-relaxed transition-all duration-500 ${isActive ? 'text-white/50' : 'text-white/35 group-hover:text-white/45'}`}>
            {step.description}
          </p>
        </div>

        {/* Bottom progress indicator */}
        <div className="mt-6">
          <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: isActive ? '100%' : '0%',
                background: `linear-gradient(to right, ${step.color}, ${step.color}60)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Connection arrow pointing right (hidden on last card) */}
      {index < total - 1 && (
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20 pointer-events-none hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-dark-900 border border-white/10 text-white/30 shadow-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ─── Tech Tag with glow hover ─── */
function TechTag({ tech, index, isVisible }) {
  return (
    <span
      className={`group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold uppercase tracking-wider
        bg-dark-800/40 border border-white/5 text-white/60
        hover:border-primary-500/40 hover:text-white hover:bg-dark-800/70 hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-1
        transition-all duration-500 cursor-default
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
      `}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-primary-400/50 group-hover:bg-primary-400 group-hover:shadow-sm group-hover:shadow-primary-400/50 transition-all duration-300" />
      {tech}
      {/* Hover glow */}
      <span className="absolute inset-0 rounded-2xl bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </span>
  );
}

/* ─── Lightbox Component ─── */
function Lightbox({ screenshots, activeIndex, onClose, onNext, onPrev, getFileUrl }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="relative max-w-5xl max-h-[85vh] w-full mx-4" onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button onClick={onClose}
          className="absolute -top-12 right-0 text-white/50 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
          <span>Close</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <img
            src={getFileUrl(screenshots[activeIndex])}
            alt={`Screenshot ${activeIndex + 1}`}
            className="w-full h-auto max-h-[80vh] object-contain bg-dark-900"
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <button onClick={onPrev}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-wider">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Previous
          </button>

          <span className="text-white/30 text-xs font-bold uppercase tracking-wider">
            {activeIndex + 1} / {screenshots.length}
          </span>

          <button onClick={onNext}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-wider">
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}


/* ════════════════════════════════════════════
   ═══ MAIN DETAIL PAGE ═══
   ════════════════════════════════════════════ */
export default function ProjectDetailPage({ params }) {
  const { id } = use(params);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [techVisible, setTechVisible] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const timelineRef = useRef(null);
  const techRef = useRef(null);
  const scrollRef = useRef(null);

  const scrollTimeline = (direction) => {
    const steps = project?.processSteps || defaultProcessSteps;
    if (direction === 'left') {
      setActiveStep(prev => (prev - 1 + steps.length) % steps.length);
    } else {
      setActiveStep(prev => (prev + 1) % steps.length);
    }
  };

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then(setProject)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  /* Intersection observer for timeline */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTimelineVisible(true); },
      { threshold: 0.15 }
    );
    if (timelineRef.current) observer.observe(timelineRef.current);
    return () => observer.disconnect();
  }, [project]);

  /* Intersection observer for tech section */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTechVisible(true); },
      { threshold: 0.2 }
    );
    if (techRef.current) observer.observe(techRef.current);
    return () => observer.disconnect();
  }, [project]);

  /* Auto-cycle active step when timeline is visible */
  useEffect(() => {
    if (!timelineVisible) return;
    const steps = project?.processSteps || defaultProcessSteps;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [timelineVisible, project]);

  /* Scroll timeline horizontally when activeStep changes */
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = 345; // Card width + gap
      container.scrollTo({
        left: activeStep * cardWidth,
        behavior: 'smooth'
      });
    }
  }, [activeStep]);

  /* Lightbox handlers */
  const openLightbox = useCallback((i) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(-1), []);
  const nextLightbox = useCallback(() => {
    if (!project?.screenshots) return;
    setLightboxIndex(prev => (prev + 1) % project.screenshots.length);
  }, [project]);
  const prevLightbox = useCallback(() => {
    if (!project?.screenshots) return;
    setLightboxIndex(prev => (prev - 1 + project.screenshots.length) % project.screenshots.length);
  }, [project]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-primary-500/20 rounded-full" />
          <div className="absolute inset-0 w-14 h-14 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Loading project...</p>
      </div>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-dark-800/50 flex items-center justify-center">
          <span className="text-4xl">😕</span>
        </div>
        <h2 className="text-xl font-heading font-bold text-white mb-2">Project Not Found</h2>
        <p className="text-white/40 text-sm mb-6">The project you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/projects" className="btn-primary text-sm">← Back to Projects</Link>
      </div>
    </div>
  );

  const processSteps = project.processSteps?.length > 0 ? project.processSteps : defaultProcessSteps;

  return (
    <div className="pt-20 bg-dark-900 min-h-screen">
      {/* ═══════════════════════════════════════════
          ═══ HERO SECTION — Animated Mesh BG ═══
          ═══════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-24 overflow-hidden project-detail-hero"
        style={{
          background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1040 20%, #2d1b69 40%, #0e3a5e 60%, #1a1040 80%, #0a0a1a 100%)',
          backgroundSize: '400% 400%',
        }}>

        {/* Animated background effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Morphing blob 1 */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-500/8 blob-morph" />
          {/* Morphing blob 2 */}
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent-cyan/6 blob-morph"
            style={{ animationDelay: '-7s' }} />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 grid-bg-pattern" />
          {/* Particles */}
          <Particles count={15} />
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />

        <div className="section-container relative z-10">
          {/* Breadcrumb — Glassmorphic */}
          <Reveal direction="up">
            <nav className="inline-flex items-center gap-2 text-xs text-white/40 mb-10 px-4 py-2 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <Link href="/" className="hover:text-primary-400 transition-colors">Home</Link>
              <svg className="w-3 h-3 text-white/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
              <Link href="/projects" className="hover:text-primary-400 transition-colors">Projects</Link>
              <svg className="w-3 h-3 text-white/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
              <span className="text-white/60 font-medium">{project.name}</span>
            </nav>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Info */}
            <Reveal direction="left">
              <div>
                {/* Category + Featured badge */}
                <div className="flex items-center gap-3 mb-5">
                  {project.category && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                      {project.category}
                    </span>
                  )}
                  {project.featured && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black leading-[1.1] mb-5">
                  <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                    {project.name}
                  </span>
                </h1>

                {/* Role */}
                {project.role && (
                  <p className="text-primary-300/80 text-sm font-bold uppercase tracking-wider mb-5 flex items-center gap-2">
                    <span className="w-8 h-px bg-gradient-to-r from-primary-400 to-transparent" />
                    {project.role}
                  </p>
                )}

                {/* Description */}
                <p className="text-white/45 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                  {project.description}
                </p>

                {/* Action buttons — Staggered */}
                <div className="flex flex-wrap gap-3">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300 text-xs font-bold uppercase tracking-wider hover:-translate-y-0.5">
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      Source Code
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-violet-600 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all duration-300 text-xs font-bold uppercase tracking-wider hover:-translate-y-0.5 shimmer-effect">
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  <Link href="/projects"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-white/40 hover:text-white/70 transition-all duration-300 text-xs font-bold uppercase tracking-wider">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    All Projects
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Right — Screenshot in Browser Frame */}
            <Reveal direction="right">
              <div className="relative">
                <BrowserFrame url={project.demoUrl || project.name}>
                  {project.screenshots?.[0] ? (
                    <img src={api.getFileUrl(project.screenshots[0])} alt={project.name}
                      className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-1000" />
                  ) : (
                    <PythonCodeBlock project={project} />
                  )}
                </BrowserFrame>

                {/* Floating accent elements around frame */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent-cyan/5 rounded-full blur-2xl pointer-events-none" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          ═══ TECH STACK — Modern Tags Grid ═══
          ═══════════════════════════════════════════ */}
      {project.technologies?.length > 0 && (
        <section className="section-padding border-b border-white/[0.03] relative overflow-hidden" ref={techRef}>
          {/* Background accents */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-500/[0.02] rounded-full blur-3xl pointer-events-none" />

          <div className="section-container relative">
            <Reveal direction="up" className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/5 border border-primary-500/10 rounded-full text-[10px] font-black text-primary-400 uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                Technology Stack
              </div>
              <h2 className="section-title text-2xl sm:text-3xl">Built With</h2>
              <p className="text-white/30 text-sm mt-2 max-w-md mx-auto">
                The technologies and tools powering this project
              </p>
            </Reveal>

            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {project.technologies.map((tech, i) => (
                <TechTag key={i} tech={tech} index={i} isVisible={techVisible} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ═══════════════════════════════════════════
          ═══ DEVELOPMENT PROCESS — Horizontal Timeline ═══
          ═══════════════════════════════════════════ */}
      <section className="section-padding relative overflow-hidden" ref={timelineRef}>
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/[0.03] rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent-cyan/[0.03] rounded-full blur-3xl" />
        </div>

        <div className="section-container relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/5 border border-primary-500/10 rounded-full text-[10px] font-black text-primary-400 uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                Development Workflow
              </div>
              <h2 className="section-title text-2xl sm:text-3xl mb-0">How It Was Built</h2>
              <p className="text-white/30 text-sm mt-2 max-w-md">
                From concept to deployment — the journey of building this project
              </p>
            </div>

            {/* Scroll Navigation Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => scrollTimeline('left')}
                className="w-11 h-11 rounded-xl bg-dark-800/40 border border-white/5 text-white/40 hover:text-white hover:bg-dark-800/80 hover:border-white/15 flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={() => scrollTimeline('right')}
                className="w-11 h-11 rounded-xl bg-dark-800/40 border border-white/5 text-white/40 hover:text-white hover:bg-dark-800/80 hover:border-white/15 flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Horizontal Timeline flow */}
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scroll-smooth relative"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {processSteps.map((step, index) => (
                <HorizontalStepCard
                  key={step.id}
                  step={step}
                  index={index}
                  isActive={activeStep === index}
                  isVisible={timelineVisible}
                  total={processSteps.length}
                />
              ))}
            </div>

            {/* Bottom step quick navigators */}
            <div className="flex justify-center gap-1.5 mt-8">
              {processSteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    i === activeStep ? 'w-8 bg-primary-500' : 'w-2 bg-white/10 hover:bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          ═══ SCREENSHOTS GALLERY — Masonry + Lightbox ═══
          ═══════════════════════════════════════════ */}
      {project.screenshots?.length > 1 && (
        <section className="section-padding border-t border-white/[0.03]">
          <div className="section-container">
            <Reveal direction="up" className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/5 border border-primary-500/10 rounded-full text-[10px] font-black text-primary-400 uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                Gallery
              </div>
              <h2 className="section-title text-2xl sm:text-3xl">Project Screenshots</h2>
              <p className="text-white/30 text-sm mt-2">Click any image to view full size</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {project.screenshots.map((ss, i) => (
                <Reveal key={i} direction="up" delay={i * 0.08}>
                  <div
                    onClick={() => openLightbox(i)}
                    className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-primary-500/20 transition-all duration-500 hover:shadow-xl hover:shadow-primary-500/5 cursor-pointer"
                  >
                    <img src={api.getFileUrl(ss)} alt={`${project.name} screenshot ${i + 1}`}
                      className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-700" />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-between p-5">
                      <span className="px-3 py-1.5 bg-dark-900/80 backdrop-blur-sm rounded-xl text-[10px] font-bold text-white/70 border border-white/10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        Screenshot {i + 1}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ═══ BACK NAVIGATION ═══ */}
      <section className="pb-20">
        <div className="section-container">
          <Reveal direction="up">
            <div className="flex items-center justify-center">
              <Link href="/projects"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-dark-800/40 border border-white/5 hover:border-primary-500/20 text-white/50 hover:text-primary-400 transition-all duration-500 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-0.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <svg className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to All Projects
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-all duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ LIGHTBOX ═══ */}
      {lightboxIndex >= 0 && project.screenshots && (
        <Lightbox
          screenshots={project.screenshots}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextLightbox}
          onPrev={prevLightbox}
          getFileUrl={api.getFileUrl}
        />
      )}
    </div>
  );
}
