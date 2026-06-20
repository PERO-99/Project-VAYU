import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import LivingGrid from '../components/LivingGrid'

const GRID_ITEMS = [
  { id: 'hero-grid-1', caption: 'River Systems', title: 'The Living Veins' },
  { id: 'hero-grid-2', caption: 'Soil & Growth', title: 'Foundations' },
  { id: 'hero-grid-3', caption: 'Glaciers', title: 'Frozen Archives' },
  { id: 'hero-grid-4', caption: 'Mangroves', title: 'Coastal Guardians' },
  { id: 'hero-grid-5', caption: 'Terraced Fields', title: 'Human Geometry' },
  { id: 'hero-grid-6', caption: 'Coral Reefs', title: 'Underwater Cities' },
  { id: 'hero-grid-7', caption: 'Drought & Life', title: 'The Edge' },
  { id: 'hero-grid-8', caption: 'Old Growth', title: 'Cathedral Forests' },
  { id: 'hero-grid-9', caption: 'Arctic Tundra', title: 'Frozen Horizon' },
  { id: 'hero-grid-10', caption: 'Urban Gardens', title: 'Green Roofs' },
  { id: 'hero-grid-11', caption: 'Wildfire', title: 'Renewal by Flame' },
  { id: 'hero-grid-12', caption: 'Ocean Life', title: 'Dancing Dolphins' },
]

export default function Home() {
  const [activeCaption, setActiveCaption] = useState<string | null>(null)
  const [activeTitle, setActiveTitle] = useState<string | null>(null)

  const briefingSectionRef = useRef<HTMLDivElement>(null)
  const darkPanelRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const revealBlocksRef = useRef<(HTMLDivElement | null)[]>([])
  const showcaseTitleRef = useRef<HTMLDivElement>(null)
  const ecoServicesRef = useRef<HTMLDivElement>(null)
  const accentRotateRef = useRef<HTMLSpanElement>(null)
  const parallaxBgRef = useRef<HTMLDivElement>(null)
  const earthRef = useRef<HTMLDivElement>(null)
  const videoParallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any = null

    const initEffects = async () => {
      const gsapModule = await import('gsap')
      const gsap = gsapModule.default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      // Wait for fonts + images, then refresh ScrollTrigger so positions are exact
      await document.fonts.ready
      await new Promise(r => setTimeout(r, 100))
      ScrollTrigger.refresh()

      ctx = gsap.context(() => {

        // ─── HERO PANEL: fade out on scroll ──────────────────────────────
        gsap.to('.hero-text-overlay', {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: '50% top',
            scrub: 1,
          },
        })

        // ─── BRIEFING → DARK PANEL: single pinned section, clip-path reveal ─
        if (briefingSectionRef.current && darkPanelRef.current) {
          ScrollTrigger.create({
            trigger: briefingSectionRef.current,
            start: 'top top',
            end: '+=150%',
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (darkPanelRef.current) {
                const pct = Math.max(0, Math.min(100, (1 - self.progress) * 100))
                darkPanelRef.current.style.clipPath = `inset(${pct}% 0 0 0)`
              }
            },
          })
        }

        // ─── MISSION: pin and slide-in bands ──────────────────────────────
        if (missionRef.current) {
          const bands = missionRef.current.querySelectorAll('.mission-band')
          const decos = missionRef.current.querySelectorAll('.mission-deco')
          const textDecos = missionRef.current.querySelectorAll('.mission-text-deco')

          // Set initial off-screen positions via GSAP (not inline CSS) to avoid transform conflicts
          gsap.set(bands, {
            xPercent: (i: number) => i % 2 === 0 ? -105 : 105,
          })

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: missionRef.current,
              start: 'top top',
              end: '+=250%',
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              scrub: 1,
            },
          })
          tl.to(bands, { xPercent: 0, ease: 'power2.inOut', stagger: 0.15, duration: 1 }, 0)
          tl.fromTo(decos, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.5 }, 0.5)
          tl.fromTo(textDecos, { opacity: 0, y: 30 }, { opacity: 0.08, y: 0, stagger: 0.1, duration: 0.5 }, 0.8)
        }

        // ─── STORY REVEAL BLOCKS ──────────────────────────────────────────
        revealBlocksRef.current.forEach((block) => {
          if (!block) return
          const overlay = block.querySelector<HTMLElement>('.reveal-overlay')
          const img = block.querySelector<HTMLElement>('img')
          if (!overlay || !img) return

          gsap.set(img, { filter: 'brightness(30%)' })
          gsap.timeline({
            scrollTrigger: {
              trigger: block,
              start: 'top 80%',
              end: 'top 25%',
              scrub: true,
            },
          })
            .to(overlay, { xPercent: 101, ease: 'none', duration: 1 }, 0)
            .to(img, { filter: 'brightness(100%)', ease: 'none', duration: 1 }, 0)
        })

        // ─── SHOWCASE TITLE 3D FLIP ───────────────────────────────────────
        if (showcaseTitleRef.current) {
          const fronts = showcaseTitleRef.current.querySelectorAll('.rotate-front')
          const backs = showcaseTitleRef.current.querySelectorAll('.rotate-back')
          const tl3d = gsap.timeline({
            scrollTrigger: {
              trigger: showcaseTitleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          })
          tl3d.to(fronts, { rotationX: 0, opacity: 1, ease: 'power3.inOut', transformOrigin: '50% 100%', stagger: 0.1, duration: 1.2 }, 0)
          tl3d.to(backs, { rotationX: -120, opacity: 0, ease: 'power3.inOut', transformOrigin: '50% 0%', stagger: 0.1, duration: 1.2 }, 0)
        }

        // ─── ECO SERVICES CARDS ───────────────────────────────────────────
        if (ecoServicesRef.current) {
          gsap.fromTo(
            ecoServicesRef.current.querySelectorAll('.eco-card'),
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: 'power2.out',
              scrollTrigger: { trigger: ecoServicesRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
            }
          )
        }

        // ─── ACCENT WORD ROTATOR ──────────────────────────────────────────
        if (accentRotateRef.current) {
          const container = accentRotateRef.current
          const children = Array.from(container.children) as HTMLElement[]
          let index = 0
          // Hide all words first, show only word 0
          children.forEach((child, i) => {
            child.style.position = i === 0 ? 'relative' : 'absolute'
            child.style.top = '0'
            child.style.left = '0'
            child.style.width = '100%'
            gsap.set(child, { yPercent: i === 0 ? 0 : 110, opacity: i === 0 ? 1 : 0 })
          })
          const interval = setInterval(() => {
            const nextIndex = (index + 1) % children.length
            gsap.to(children[index], { yPercent: -110, opacity: 0, duration: 0.45, ease: 'power2.inOut' })
            gsap.fromTo(children[nextIndex],
              { yPercent: 110, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power2.inOut', delay: 0.05 }
            )
            index = nextIndex
          }, 3000)
          return () => clearInterval(interval)
        }

        // ─── PARALLAX BACKGROUND (dark panel bg) ──────────────────────────
        if (parallaxBgRef.current) {
          gsap.to(parallaxBgRef.current, {
            y: '-15%',
            ease: 'none',
            scrollTrigger: { trigger: briefingSectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        }

        // ─── EARTH GLOBE ROTATION + SCROLL PARALLAX ───────────────────────
        if (earthRef.current) {
          gsap.to(earthRef.current, { rotation: 360, duration: 60, ease: 'none', repeat: -1 })
          gsap.to(earthRef.current, {
            rotationX: 25, y: -40, scale: 1.08, ease: 'none',
            scrollTrigger: { trigger: '.cta-section', start: 'top bottom', end: 'bottom top', scrub: 1 },
          })
        }

        // ─── VIDEO PARALLAX ───────────────────────────────────────────────
        if (videoParallaxRef.current) {
          gsap.to(videoParallaxRef.current, {
            y: '-12%',
            ease: 'none',
            scrollTrigger: { trigger: '.cta-section', start: 'top bottom', end: 'bottom top', scrub: true },
          })
        }

      }) // end gsap.context
    }

    initEffects()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [])

  const handleGridHover = (item: typeof GRID_ITEMS[0] | null) => {
    setActiveCaption(item?.caption ?? null)
    setActiveTitle(item?.title ?? null)
  }

  const caption = activeCaption || 'Carbon Footprint Awareness Platform'
  const title = activeTitle || 'VAYU'

  return (
    <main>
      {/* ── HERO: left 60% scrolling grid + right 40% frosted panel ── */}
      <section className="hero-section relative w-full overflow-hidden" style={{ height: '100vh', display: 'flex' }}>

        {/* LEFT: scrolling image grid — 60% width */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ width: '60%' }}>
          <LivingGrid items={GRID_ITEMS} onHover={handleGridHover} />

          {/* Hover label shown over the grid on mouse over */}
          {activeTitle && (
            <div className="absolute bottom-8 left-6 z-20 pointer-events-none">
              <p className="text-caption text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{activeCaption}</p>
              <p className="text-white font-display" style={{ fontSize: 'clamp(18px,2vw,28px)', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>{activeTitle}</p>
            </div>
          )}
        </div>

        {/* RIGHT: frosted glass branding panel — 40% width */}
        <div className="hero-text-overlay" style={{ position: 'relative', width: '40%', flex: '0 0 40%' }}>
          <div className="hero-text-inner">
            <h1 className="sr-only">VAYU — Carbon Footprint Awareness Platform</h1>
            <img src="/vayu-logo-full.svg" alt="VAYU" className="hero-logo" />
            <p className="hero-tagline">
              Balance Your Breath.<br />Balance the Atmosphere.
            </p>
            <Link to="/stories" className="btn-pill btn-pill-primary no-underline" style={{ marginTop: '2rem' }}>
              Explore the Archive
            </Link>
          </div>
        </div>

      </section>

      {/* ── BRIEFING + DARK PANEL (single pinned container) ── */}
      <div ref={briefingSectionRef} className="relative" style={{ height: '100vh' }}>
        {/* Light briefing panel */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: '#F2EDE8', zIndex: 1 }}
        >
          <div className="text-center max-w-[640px] px-6">
            <span className="text-caption text-[#C07A5F] block mb-4">01 / THE BRIEFING</span>
            <h2 className="text-h1 font-display text-[#0E0E0E] mb-6">A State of Flux</h2>
            <p className="text-body-large text-[#0E0E0E] mb-12 opacity-80">
              Our planet is undergoing unprecedented change. From shifting weather patterns to habitat fragmentation, the signals are everywhere. VAYU exists to make these changes visible — not through alarm, but through observation.
            </p>
            <div className="flex gap-[2vw] justify-center">
              <img src="/images/hero-grid-1.jpg" alt="" className="w-[45%] object-cover rounded" style={{ aspectRatio: '3/2' }} />
              <img src="/images/hero-grid-7.jpg" alt="" className="w-[45%] object-cover rounded" style={{ aspectRatio: '3/2' }} />
            </div>
          </div>
        </div>

        {/* Dark panel overlaid on top — clips in from top */}
        <div
          ref={darkPanelRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: '#0E0E0E', clipPath: 'inset(100% 0 0 0)', zIndex: 2 }}
        >
          <div ref={parallaxBgRef} className="absolute inset-0" style={{ height: '120%', top: '-10%' }}>
            <img src="/images/home-briefing-bg.jpg" alt="" className="w-full h-full object-cover opacity-30" />
          </div>
          <div className="relative z-10 text-center max-w-[640px] px-6">
            <span className="text-caption text-[#C07A5F] block mb-4">02 / THE FRAME</span>
            <h2 className="text-h1 font-display text-white mb-6">Every Perspective Shifts the Narrative</h2>
            <p className="text-body-large text-white opacity-80">
              Photography is an act of selection. What we choose to show shapes what others believe is possible. VAYU curates environmental storytelling from indigenous communities, scientists, and artists working at the edge.
            </p>
          </div>
        </div>
      </div>

      {/* ── MISSION ── */}
      <section
        ref={missionRef}
        className="relative w-full overflow-hidden"
        style={{ height: '100vh', background: '#4A5D43' }}
      >
        {/* No inline transform — GSAP sets initial positions via gsap.set() */}
        <div className="mission-band w-full flex items-center justify-center" style={{ height: '33.33vh' }}>
          <h2 className="text-h1 font-display text-white">Document</h2>
        </div>
        <div className="mission-band w-full flex items-center justify-center" style={{ height: '33.33vh' }}>
          <p className="text-body-large text-white opacity-80 max-w-[600px] text-center px-6">
            the beauty, fragility, and resilience
          </p>
        </div>
        <div className="mission-band w-full flex items-center justify-center" style={{ height: '33.33vh' }}>
          <h2 className="text-h1 font-display text-white">of Earth's living systems</h2>
        </div>

        {/* Labels */}
        <span className="mission-deco text-caption text-white absolute top-8 left-8" style={{ opacity: 0 }}>Since 2024</span>
        <span className="mission-deco text-caption text-white absolute top-8 right-8" style={{ opacity: 0 }}>24.7741° N, 122.4532° W</span>
        <span className="mission-deco text-caption text-white absolute bottom-8 left-1/2 -translate-x-1/2" style={{ opacity: 0 }}>Nature Reserve</span>

        {/* ── 4-corner photo clusters ── each pair is side-by-side so they never overlap ── */}

        {/* TOP-LEFT: two images side-by-side */}
        <img src="/images/home-community-1.jpg" alt="" className="mission-deco absolute object-cover rounded" style={{ opacity: 0, width: '12vw', height: '9vw', top: '4%', left: '2%' }} />
        <img src="/images/home-deco-1.jpg" alt="" className="mission-deco absolute object-cover rounded" style={{ opacity: 0, width: '9vw', height: '9vw', top: '4%', left: '15%' }} />

        {/* TOP-RIGHT: two images side-by-side */}
        <img src="/images/home-deco-3.jpg" alt="" className="mission-deco absolute object-cover rounded" style={{ opacity: 0, width: '9vw', height: '9vw', top: '4%', right: '15%' }} />
        <img src="/images/hero-grid-3.jpg" alt="" className="mission-deco absolute object-cover rounded" style={{ opacity: 0, width: '12vw', height: '9vw', top: '4%', right: '2%' }} />

        {/* BOTTOM-LEFT: two images side-by-side */}
        <img src="/images/home-deco-2.jpg" alt="" className="mission-deco absolute object-cover rounded" style={{ opacity: 0, width: '9vw', height: '9vw', bottom: '4%', left: '2%' }} />
        <img src="/images/home-stories-1.jpg" alt="" className="mission-deco absolute object-cover rounded" style={{ opacity: 0, width: '12vw', height: '9vw', bottom: '4%', left: '12%' }} />

        {/* BOTTOM-RIGHT: two images side-by-side */}
        <img src="/images/home-community-2.jpg" alt="" className="mission-deco absolute object-cover rounded" style={{ opacity: 0, width: '12vw', height: '9vw', bottom: '4%', right: '12%' }} />
        <img src="/images/hero-grid-6.jpg" alt="" className="mission-deco absolute object-cover rounded" style={{ opacity: 0, width: '9vw', height: '9vw', bottom: '4%', right: '2%' }} />

        {/* Ghost text watermarks */}
        <span className="mission-text-deco absolute text-display-xl text-transparent pointer-events-none select-none" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', left: '10vw', top: '15%', opacity: 0 }}>WHAT</span>
        <span className="mission-text-deco absolute text-display-xl text-transparent pointer-events-none select-none" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', left: '50vw', top: '40%', opacity: 0 }}>WE</span>
        <span className="mission-text-deco absolute text-display-xl text-transparent pointer-events-none select-none" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', left: '70vw', top: '65%', opacity: 0 }}>SEEK</span>
      </section>

      {/* ── ECO SERVICES ── */}
      <section className="w-full section-padding" style={{ background: '#A69F97' }}>
        <div className="content-max">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-[35%] lg:sticky lg:top-32 lg:self-start">
              <h2 className="text-h2 font-display text-[#0E0E0E] mb-2">Ecosystem Services</h2>
              <div className="text-h3 font-display text-[#C07A5F] mb-6">
                <span ref={accentRotateRef} className="accent-rotate">
                  <span className="accent-word">Regulate</span>
                  <span className="accent-word">Support</span>
                  <span className="accent-word">Provide</span>
                  <span className="accent-word">Cultural</span>
                </span>
              </div>
              <p className="text-body-large text-[#0E0E0E] opacity-80">
                Nature provides essential services that sustain human life. Understanding these services helps us value and protect the ecosystems that{' '}
                <span className="underline decoration-[#C07A5F] underline-offset-4">support our existence</span>.
              </p>
            </div>

            <div ref={ecoServicesRef} className="lg:w-[60%] lg:ml-[5%] flex flex-col gap-8">
              {[
                { img: '/images/home-stories-1.jpg', label: 'Provisioning', title: 'Provisioning', desc: 'Food, freshwater, timber, fiber. The resources that sustain civilization.' },
                { img: '/images/home-stories-2.jpg', label: 'Regulating', title: 'Regulating', desc: "Climate regulation, flood control, disease moderation. Nature's infrastructure." },
                { img: '/images/home-stories-3.jpg', label: 'Supporting', title: 'Supporting', desc: 'Soil formation, photosynthesis, nutrient cycling. The invisible foundation.' },
                { img: '/images/home-community-3.jpg', label: 'Cultural', title: 'Cultural', desc: 'Recreation, spiritual value, aesthetic inspiration. The connection that drives protection.' },
              ].map((card, i) => (
                <div key={i} className="eco-card bg-[#F2EDE8] rounded-lg overflow-hidden">
                  <div className="overflow-hidden" style={{ aspectRatio: '16/10' }}>
                    <img src={card.img} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]" />
                  </div>
                  <div className="p-6">
                    <span className="text-caption text-[#C07A5F]">{card.label}</span>
                    <h3 className="text-h3 font-display text-[#0E0E0E] mt-1 mb-2">{card.title}</h3>
                    <p className="text-body-large text-[#0E0E0E] opacity-60">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STORY SHOWCASES ── */}
      <section className="w-full section-padding bg-[#F2EDE8]">
        <div className="content-max">
          {[
            { img: '/images/home-stories-1.jpg', caption: 'PHOTO ESSAY', title: 'The Last Glaciers', body: "In Patagonia, ice that formed over millennia retreats by meters each year. Photographers document what's left before it becomes memory.", layout: 'left' },
            { img: '/images/home-stories-2.jpg', caption: 'FIELD REPORT', title: 'Urban Rewilding', body: 'Cities from Singapore to Berlin are reintroducing wild corridors. The results challenge everything we assumed about density and nature.', layout: 'right' },
            { img: '/images/home-stories-3.jpg', caption: 'DOCUMENTARY', title: 'The Soil Beneath', body: "A single teaspoon of healthy soil contains more organisms than there are humans on Earth. Farmers and scientists are racing to understand what's being lost.", layout: 'left' },
          ].map((story, i) => (
            <div
              key={i}
              className={`flex flex-col ${story.layout === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-[8%] items-center mb-24 last:mb-0`}
            >
              <div
                ref={(el) => { revealBlocksRef.current[i] = el }}
                className="reveal-block w-full lg:w-[55%]"
              >
                <div className="reveal-overlay" />
                <img
                  src={story.img}
                  alt={story.title}
                  className="w-full object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
              </div>
              <div className="w-full lg:w-[37%] mt-8 lg:mt-0">
                <span className="text-caption text-[#C07A5F] block mb-3">{story.caption}</span>
                <h3 className="text-h3 font-display text-[#0E0E0E] mb-4">{story.title}</h3>
                <p className="text-body-large text-[#0E0E0E] opacity-70 mb-6">{story.body}</p>
                <Link to="/stories" className="inline-flex items-center gap-2 text-[#0E0E0E] hover:gap-3 transition-all">
                  <span className="text-body-large">View Essay</span>
                  <span className="text-lg">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMUNITY SHOWCASE ── */}
      <section className="w-full section-padding bg-[#0E0E0E]">
        <div className="content-max mb-12">
          <span className="text-caption text-[#C07A5F] block mb-4">COMMUNITY</span>
          <div ref={showcaseTitleRef} className="showcase-title">
            {['Work', 'from', 'the', 'Field'].map((word, i) => (
              <span key={i} className="rotate-word">
                <span className="rotate-front text-h1 font-display text-white">{word}</span>
                <span className="rotate-back text-h1 font-display">{word}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="horizontal-scroll pl-[clamp(20px,4vw,64px)] pb-4">
          {[
            { img: '/images/home-community-1.jpg', caption: 'Northern Lights', name: 'Erik Lindqvist' },
            { img: '/images/home-community-2.jpg', caption: 'Manta Rays', name: 'Sarah Chen' },
            { img: '/images/home-community-3.jpg', caption: 'Baobab Avenue', name: 'Jean-Pierre R.' },
            { img: '/images/home-community-4.jpg', caption: 'Bioluminescence', name: 'Mia Torres' },
            { img: '/images/home-community-5.jpg', caption: 'Autumn Vines', name: 'Isabella Rossi' },
            { img: '/images/home-community-6.jpg', caption: 'Field Research', name: 'Aisha Johnson' },
          ].map((item, i) => (
            <div
              key={i}
              className="relative rounded-lg overflow-hidden group"
              style={{ minWidth: '60vw', aspectRatio: '16/10' }}
            >
              <img src={item.img} alt={item.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(transparent 50%, rgba(14,14,14,0.7))' }} />
              <div className="absolute bottom-6 left-6">
                <span className="text-caption text-white opacity-80">{item.caption}</span>
                <p className="text-white text-sm mt-1 opacity-60">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section w-full relative overflow-hidden bg-[#0E0E0E]" style={{ padding: 'clamp(120px, 20vh, 240px) 0' }}>
        <div ref={videoParallaxRef} className="absolute inset-0 overflow-hidden" style={{ height: '130%', top: '-15%' }}>
          <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-20">
            <source src="/videos/hero-ambient.mp4" type="video/mp4" />
          </video>
        </div>

        <div ref={earthRef} className="home-earth" />

        <div className="content-max text-center relative z-10">
          <h2 className="text-h1 font-display text-white mb-6">Stay in the Loop</h2>
          <p className="text-body-large text-white opacity-60 max-w-[480px] mx-auto mb-10">
            One story a week. No noise. No panic. Just quiet, persistent attention to the world around us.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap mb-8">
            <input
              type="email"
              placeholder="Your email"
              className="bg-transparent border-b border-[rgba(255,255,255,0.25)] text-[18px] py-3 px-0 w-[280px] outline-none focus:border-[#C07A5F] transition-colors placeholder:text-[rgba(255,255,255,0.3)] text-white"
            />
            <button className="btn-pill bg-[#C07A5F] text-white hover:bg-[#a86a4f]">Subscribe</button>
          </div>
          <div className="flex items-center justify-center gap-6">
            <Link to="/gemini" className="text-caption text-[#C07A5F] hover:opacity-80 transition-opacity no-underline flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C07A5F] animate-pulse" />
              Ask Vayu AI
            </Link>
            <Link to="/explore" className="text-caption text-white opacity-60 hover:opacity-100 transition-opacity no-underline">Explore Biomes</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
