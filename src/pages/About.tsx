import { useEffect, useRef } from 'react'
import { Link } from 'react-router'

export default function About() {
  const valuesRef = useRef<HTMLDivElement>(null)
  const originImgRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const init = async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (valuesRef.current) {
        const valueItems = valuesRef.current.querySelectorAll('.value-item')
        gsap.fromTo(valueItems,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: valuesRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      if (originImgRef.current) {
        gsap.to(originImgRef.current.querySelector('img'), {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: originImgRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      if (heroVideoRef.current) {
        gsap.to(heroVideoRef.current, {
          y: '-15%',
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: heroVideoRef.current.parentElement,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    }

    init()
  }, [])

  return (
    <main>
      <section className="w-full relative flex items-center justify-center overflow-hidden" style={{ height: '70vh' }}>
        <video
          ref={heroVideoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transformOrigin: 'center center' }}
        >
          <source src="/videos/about-hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[rgba(14,14,14,0.6)]" />
        <div className="relative z-10 text-center px-6">
          <span className="text-caption text-[#C07A5F] block mb-4">ABOUT VAYU</span>
          <h1 className="text-display font-display text-white mb-4">Observation as Resistance</h1>
          <p className="text-body-large text-white opacity-70 max-w-[520px] mx-auto">
            We believe that paying attention is the first act of care.
          </p>
        </div>
      </section>

      <section className="w-full section-padding bg-[#F2EDE8]">
        <div className="content-max">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div ref={originImgRef} className="lg:w-[45%] overflow-hidden">
              <img
                src="/images/about-origin.jpg"
                alt="The VAYU team in the field"
                className="w-full object-cover"
                style={{ aspectRatio: '3/4' }}
              />
            </div>

            <div className="lg:w-[55%]">
              <span className="text-caption text-[#C07A5F] block mb-4">ORIGIN</span>
              <h2 className="text-h2 font-display text-[#0E0E0E] mb-8">Started with a Question</h2>
              <div className="max-w-[520px] space-y-6">
                <p className="text-[16px] font-light leading-[1.65] text-[#0E0E0E]">
                  What if we approached climate storytelling with the same craft as the world's best editorial publications? Not louder. Not angrier. Just better considered.
                </p>
                <p className="text-[16px] font-light leading-[1.65] text-[#0E0E0E]">
                  VAYU was founded in 2024 by a collective of photographers, ecologists, and designers who believe that beauty is not the enemy of urgency. That wonder can coexist with warning.
                </p>
                <p className="text-[16px] font-light leading-[1.65] text-[#0E0E0E]">
                  We publish photo essays, field reports, and long-form features. We commission work from indigenous storytellers and early-career environmental photographers.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 mt-8 text-[#0E0E0E] hover:gap-3 transition-all no-underline"
              >
                <span className="text-body-large">Get in Touch</span>
                <span className="text-lg">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full section-padding bg-[#0E0E0E]">
        <div ref={valuesRef} className="content-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              { num: '01', title: 'Observation First', body: 'We document before we diagnose. Every story begins with looking closely.' },
              { num: '02', title: 'Community Second', body: 'Our contributors are collaborators. Credit, compensation, and creative freedom are non-negotiable.' },
              { num: '03', title: 'Action Third', body: 'Attention leads to intention. We partner with organizations turning observation into impact.' },
            ].map((value, i) => (
              <div key={i} className="value-item py-12 border-t border-[rgba(242,237,232,0.15)]">
                <span className="text-display-xl text-white opacity-[0.15] block mb-4">{value.num}</span>
                <h3 className="text-h3 font-display text-white mb-4">{value.title}</h3>
                <p className="text-[16px] font-light leading-[1.65] text-white opacity-70 max-w-[320px]">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full section-padding bg-[#F2EDE8]">
        <div className="content-max text-center">
          <h2 className="text-h2 font-display text-[#0E0E0E] mb-4">The Network</h2>
          <p className="text-body-large text-[#0E0E0E] opacity-70 max-w-[600px] mx-auto mb-16">
            Contributors in 34 countries. Partner organizations across conservation, science communication, and environmental policy.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {[
              { num: '200+', label: 'Contributors' },
              { num: '34', label: 'Countries' },
              { num: '50+', label: 'Partner Orgs' },
              { num: '12', label: 'Languages' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <span className="text-h1 font-display text-[#0E0E0E] block mb-2">{stat.num}</span>
                <span className="text-caption text-[#0E0E0E] opacity-60">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 max-w-[800px] mx-auto">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-20 h-20 bg-[rgba(14,14,14,0.08)] rounded mx-auto" style={{ opacity: 0.5 }} />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full flex items-center justify-center bg-[#4A5D43]" style={{ padding: 'clamp(120px, 20vh, 240px) 0' }}>
        <div className="text-center px-6">
          <h2 className="text-h1 font-display text-white mb-6">Want to Contribute?</h2>
          <p className="text-body-large text-white opacity-80 max-w-[520px] mx-auto mb-10">
            We're always looking for photographers, writers, and researchers working at the intersection of visual culture and environmental change.
          </p>
          <Link to="/contact" className="btn-pill bg-[#C07A5F] text-white hover:bg-[#a86a4f] no-underline">
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  )
}
