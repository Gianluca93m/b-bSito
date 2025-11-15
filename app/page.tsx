"use client";
import Banner from "./Banner";
import DateFilterWidget from "./DateFilterWidget";
import Gallery from "./components/Gallery";
import Newsletter from "./components/Newsletter";
import React, { useEffect, useState, useRef } from "react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  // Offer popup bottom
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Show the offer popup once unless dismissed (persisted in localStorage)
    try {
      const dismissed = localStorage.getItem("offerDismissed");
      if (!dismissed) {
        const t = setTimeout(() => setShowOfferPopup(true), 900);
        return () => clearTimeout(t);
      }
    } catch (e) {
      // ignore (server environments or strict privacy modes)
      setShowOfferPopup(true);
    }
  }, []);

  // Map overlay entrance animation
  const [mapCardVisible, setMapCardVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMapCardVisible(true), 350);
    return () => clearTimeout(t);
  }, []);

  // Selected place for the map overlay / in-page map center (avoid external redirect)
  const defaultPlace = {
    name: "B&B Paradise",
    title: "Dove siamo",
    address: "Via Roma 12, 72017 Ostuni (BR), Italia",
    details: "Parcheggio privato · A 5 min dal centro",
    phone: "+39 080 1234567",
    // query used to center the embedded map (keeps it in-page)
    query: "Via Roma 12, 72017 Ostuni (BR), Italia",
    distance: "-",
  };
  // keep the overlay fixed on the main B&B (defaultPlace)
  // mapQuery drives the iframe src (keeps navigation in-page)
  const [mapQuery, setMapQuery] = useState(defaultPlace.query);
  // activeCard is the currently-selected nearby place (for highlighting)
  const [activeCard, setActiveCard] = useState<string | null>(null);
  // currentPlace is what the overlay shows (initially the main B&B but will update when a nearby place is selected)
  const [currentPlace, setCurrentPlace] = useState(defaultPlace);

  // Small accessible accordion item used in FAQ below
  function AccordionItem({ index, question, answer }: { index: number; question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    const panelId = `faq-panel-${index}`;
    const btnId = `faq-btn-${index}`;
    return (
      <div className="bg-white rounded-lg border border-[#ececec] shadow-lg overflow-hidden">
        <button
          id={btnId}
          aria-controls={panelId}
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className="w-full text-left px-4 py-4 flex items-center justify-between gap-4"
        >
          <span className="font-semibold text-[#4d5c3a]">{question}</span>
          <span className={`transform transition-transform ${open ? 'rotate-180' : 'rotate-0'}`} aria-hidden>▾</span>
        </button>
        <div id={panelId} role="region" aria-labelledby={btnId} className={`px-4 pb-4 text-[#55664a] ${open ? 'block' : 'hidden'}`}>
          <p>{answer}</p>
        </div>
      </div>
    );
  }

  // Keyboard navigation for gallery lightbox is handled inside `Gallery` component

  // Carousel state for Pacchetti promozionali (full-width)
  const packagesList = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    title: `Pacchetto ${i + 1}`,
    price: `${80 + (i % 5) * 20}€`,
    nights: 2 + (i % 3),
    desc: 'Camera confortevole, colazione inclusa, parcheggio',
  }))

  const trackRef = useRef<HTMLDivElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [visibleCount, setVisibleCount] = useState(1)

  // Testimonials data — renderable and easy to extend. If you want to
  // load these from an API later, replace this static array with a fetch.
  const testimonials = [
    {
      id: 1,
      name: 'Giulia R.',
      source: 'Booking.com',
      date: '12/10/2025',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5,
      text: 'Esperienza fantastica! Camere pulite, colazione abbondante e staff gentilissimo. Torneremo sicuramente.'
    },
    {
      id: 2,
      name: 'Marco P.',
      source: 'Google',
      date: '05/09/2025',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      text: 'Location perfetta per rilassarsi. Piscina e spa top. Consigliato!'
    },
    {
      id: 3,
      name: 'Laura B.',
      source: 'Tripadvisor',
      date: '22/08/2025',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      rating: 5,
      text: 'Colazione eccellente e posizione comoda. Staff disponibile e gentile.'
    },
    {
      id: 4,
      name: 'Luca M.',
      source: 'Direct',
      date: '10/07/2025',
      avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
      rating: 5,
      text: 'Stanze spaziose e pulite. Torneremo in estate per rilassarci ancora.'
    },
    {
      id: 5,
      name: 'Anna S.',
      source: 'Booking.com',
      date: '28/06/2025',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
      rating: 5,
      text: 'Ottima esperienza per famiglie, bimbi entusiasti e area giochi vicina.'
    },
    {
      id: 6,
      name: 'Paolo R.',
      source: 'Google',
      date: '15/05/2025',
      avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
      rating: 5,
      text: 'Perfetto per un weekend romantico. Colazione in terrazza magnifica.'
    }
  ]

  // update visibleCount on resize (1 / 2 / 3 depending on width)
  useEffect(() => {
    function update() {
      const w = window.innerWidth
      if (w >= 1024) setVisibleCount(3)
      else if (w >= 768) setVisibleCount(2)
      else setVisibleCount(1)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const id = setInterval(() => {
      setCarouselIndex((c) => {
        const maxIndex = Math.max(0, packagesList.length - visibleCount)
        return c + 1 <= maxIndex ? c + 1 : 0
      })
    }, 2000)
    return () => clearInterval(id)
  }, [isPaused, packagesList.length, visibleCount])

  // scroll track to the active item when index changes
  useEffect(() => {
    const track = trackRef.current
    const inner = innerRef.current
    if (!track || !inner) return
    const items = Array.from(inner.querySelectorAll('.carousel-item')) as HTMLElement[]
    const target = items[carouselIndex]
    if (!target) return
    // Calculate desired translate so the target item is centered inside track viewport
    const trackWidth = track.clientWidth
    const targetCenter = target.offsetLeft + target.clientWidth / 2
    const desired = Math.round(targetCenter - trackWidth / 2)
    const maxTranslate = Math.max(0, inner.scrollWidth - trackWidth)
    const clamped = Math.max(0, Math.min(desired, maxTranslate))
    inner.style.transform = `translateX(-${clamped}px)`
  }, [carouselIndex, visibleCount])

  // When visibleCount changes, ensure index is within valid bounds
  useEffect(() => {
    const maxIndex = Math.max(0, packagesList.length - visibleCount)
    setCarouselIndex((i) => (i > maxIndex ? maxIndex : i))
  }, [visibleCount, packagesList.length])

  // Reveal animation for testimonials: use IntersectionObserver to add an
  // "in-view" class when testimonial cards scroll into viewport. This
  // keeps the markup simple and avoids extra dependencies.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const cards = Array.from(document.querySelectorAll('.testimonial-card')) as HTMLElement[]
    if (!cards.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) el.classList.add('in-view')
          else el.classList.remove('in-view')
        })
      },
      { threshold: 0.12 }
    )

    // Immediately mark cards that are already inside the viewport as in-view
    // This prevents the case where only the first card gets observed as visible
    // and the rest remain hidden until scroll/resize.
    const winH = window.innerHeight || document.documentElement.clientHeight
    cards.forEach((c) => {
      const r = c.getBoundingClientRect()
      if (r.top < winH && r.bottom > 0) c.classList.add('in-view')
      obs.observe(c)
    })

    return () => obs.disconnect()
  }, [])

  // reference for the horizontal testimonial track (to implement prev/next)
  const testimonialTrackRef = useRef<HTMLDivElement | null>(null)

  function scrollTestimonial(by: number) {
    const el = testimonialTrackRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.7) * by
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#ececec]">
        <div className={`container mx-auto px-8 flex justify-between items-center ${scrolled ? 'py-3' : 'py-5'} transition-all duration-300`}>
          <div className="flex items-center gap-3">
            <img src="/logo-beb.png" alt="Logo" className={`${scrolled ? 'h-10 w-10' : 'h-12 w-12'} rounded-full border border-[#ececec] shadow transition-all duration-300`} />
            <span className={`font-sans font-bold ${scrolled ? 'text-lg' : 'text-xl'} text-[#4d5c3a] tracking-tight transition-all duration-300`}>B&B Paradise</span>
          </div>
          <ul className={`flex ${scrolled ? 'gap-6 text-sm' : 'gap-8 text-sm'} font-500 items-center transition-all duration-300`}>
            {[
              { href: '/', label: 'Home' },
              { href: '/camere', label: 'Camere' },
              { href: '/prenota', label: 'Prenota' },
              { href: '/prenota-pacchetto', label: 'Pacchetti' },
              { href: '/admin', label: 'Admin' },
              { href: '/auth/signin', label: 'Login' },
              { href: '/auth/register', label: 'Registrati' },
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[#4d5c3a] hover:text-[#bfae82] px-2 py-2 transition-colors duration-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {/* Hero section - Luxury Design */}
      <main className="pt-0 pb-0 px-0 flex flex-col items-center font-sans">
        <section className="w-full relative flex flex-col items-center justify-center min-h-[90vh] sm:min-h-screen bg-cover bg-center overflow-hidden" style={{backgroundImage: 'url(https://images.pexels.com/photos/19075385/pexels-photo-19075385.jpeg)', backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center 30%'}}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 mb-12 sm:mb-16 fade-in-up">
              <div className="inline-block">
                <span className="text-[#bfae82] text-xs sm:text-sm font-bold uppercase tracking-widest">Lusso & Ospitalità</span>
              </div>
              <h1 className="hero-title font-serif font-bold">Vivi un soggiorno indimenticabile</h1>
              <p className="hero-subtitle font-light">Nel cuore di Ostuni, dove il fascino della Puglia incontra l'eleganza moderna</p>
            </div>

            <div className="relative z-20 w-full max-w-4xl px-4 sm:px-6 mb-8">
              <div className="hero-panel">
                <form className="flex flex-col gap-5 w-full" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col items-start">
                      <label htmlFor="checkin" className="text-xs font-bold text-white uppercase tracking-wider mb-3">Check-in</label>
                      <input type="date" id="checkin" name="checkin" className="w-full px-4 py-3.5 rounded-lg text-[#4d5c3a] placeholder-gray-400 font-medium" />
                    </div>
                    <div className="flex flex-col items-start">
                      <label htmlFor="checkout" className="text-xs font-bold text-white uppercase tracking-wider mb-3">Check-out</label>
                      <input type="date" id="checkout" name="checkout" className="w-full px-4 py-3.5 rounded-lg text-[#4d5c3a] placeholder-gray-400 font-medium" />
                    </div>
                    <div className="flex flex-col items-start">
                      <label htmlFor="guests" className="text-xs font-bold text-white uppercase tracking-wider mb-3">Ospiti</label>
                      <input type="number" id="guests" name="guests" min="1" max="10" defaultValue="2" className="w-full px-4 py-3.5 rounded-lg text-[#4d5c3a] placeholder-gray-400 font-medium" />
                    </div>
                    <div className="flex flex-col items-start justify-end">
                      <button type="submit" className="btn-primary w-full py-3.5">
                        Prenota Ora
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="relative z-20 flex items-center gap-8 text-white text-sm mt-8">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="hidden sm:inline">5.0 · 500+ Recensioni</span>
              </div>
              <div className="w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <span className="hidden sm:inline">Best B&B 2024</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
            <div className="text-white/60 hover:text-white transition-colors cursor-pointer text-3xl">↓</div>
          </div>
        </section>

        {/* Highlights / Trust badges */}
        <section className="w-full bg-gradient-to-b from-white to-[#fbfaf6] py-16 sm:py-20 mb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="highlight-card flex flex-col items-center text-center gap-5 transform transition-all duration-300 hover:scale-105">
                <div className="badge-circle">
                  <svg className="badge-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M21 11.5L12 2 2 12l9 9 10-9.5zM11 7a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </div>
                <div>
                  <h4 className="high-title">Miglior prezzo garantito</h4>
                  <p className="high-desc mt-2">Prenota direttamente per le migliori tariffe disponibili.</p>
                </div>
              </div>
              <div className="highlight-card flex flex-col items-center text-center gap-5 transform transition-all duration-300 hover:scale-105">
                <div className="badge-circle">
                  <svg className="badge-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 6V3L8 7l4 4V8c2.761 0 5 2.239 5 5 0 .637-.113 1.244-.318 1.797l1.518 1.518C18.83 15.079 19 14.061 19 13c0-3.866-3.134-7-7-7zM6.318 5.683L4.8 4.165C3.17 5.794 2 8.255 2 11c0 3.866 3.134 7 7 7v3l4-4-4-4v3c-2.761 0-5-2.239-5-5 0-.637.113-1.244.318-1.797z" />
                  </svg>
                </div>
                <div>
                  <h4 className="high-title">Cancellazione flessibile</h4>
                  <p className="high-desc mt-2">Cancella gratuitamente fino a 48 ore prima dell'arrivo.</p>
                </div>
              </div>
              <div className="highlight-card flex flex-col items-center text-center gap-5 transform transition-all duration-300 hover:scale-105">
                <div className="badge-circle">
                  <svg className="badge-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 2c1.657 0 3 1.79 3 4s-1.343 4-3 4-3-1.79-3-4 1.343-4 3-4zm6.5 6c1.38 0 2.5 1.343 2.5 3s-1.12 3-2.5 3-2.5-1.343-2.5-3 1.12-3 2.5-3zM5.5 8c1.38 0 2.5 1.343 2.5 3S6.88 14 5.5 14 3 12.657 3 11s1.12-3 2.5-3zM12 10c3.866 0 7 3.134 7 7 0 0-3 3-7 3s-7-3-7-3c0-3.866 3.134-7 7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="high-title">Family & pet friendly</h4>
                  <p className="high-desc mt-2">Spazi e servizi pensati per famiglie e animali domestici.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pacchetti - full width carousel */}
        <section id="pacchetti" className="carousel-bleed w-screen">
          <div className="carousel-wrapper">
            <div className="text-center mb-10 sm:mb-12 px-6 max-w-6xl mx-auto">
              <h2 className="section-title">Pacchetti promozionali</h2>
              <p className="section-subtitle">Scopri le nostre offerte speciali per il tuo soggiorno</p>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div ref={trackRef} className="carousel-track">
                <div ref={innerRef} className="carousel-track-inner">
                {packagesList.map((p, idx) => {
                  const centerIndex = carouselIndex + Math.floor(visibleCount / 2)
                  const isActive = idx === centerIndex
                  return (
                    <article key={p.id} className={`carousel-item relative card p-0 flex flex-col overflow-hidden ${isActive ? 'is-active' : ''}`}>
                    <div className="w-full h-56 relative overflow-hidden">
                      <img src={`https://picsum.photos/seed/pacchetto-${p.id}/900/600`} alt={p.title} className="object-cover w-full h-full transition-transform duration-500 hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      <span className="absolute top-4 right-4 bg-[#bfae82] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">OFFERTA</span>
                    </div>
                    <div className="p-6 flex flex-col gap-4 flex-1">
                      <h3 className="text-xl font-bold text-[#4d5c3a]">{p.title}</h3>
                      <ul className="text-[#4d5c3a] text-sm space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="text-[#bfae82] font-bold">✓</span>
                          <span>Notte confortevole</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-[#bfae82] font-bold">✓</span>
                          <span>Colazione inclusa</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-[#bfae82] font-bold">✓</span>
                          <span>Servizi dedicati</span>
                        </li>
                      </ul>
                      <div className="flex items-center gap-3 mt-auto pt-2">
                        <span className="text-3xl font-bold text-[#bfae82]">{p.price}</span>
                        <span className="text-xs text-[#6b7460] font-medium">per notte</span>
                      </div>
                      <button className="btn-primary font-semibold px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg text-sm w-full transition-all">
                        Vedi dettagli
                      </button>
                    </div>
                    </article>
                  )
                })}
                </div>
              </div>

              <div className="carousel-controls" aria-hidden>
                <button onClick={() => setCarouselIndex((i) => (i - 1 + packagesList.length) % packagesList.length)} aria-label="Previous">◀</button>
                <button onClick={() => setCarouselIndex((i) => (i + 1) % packagesList.length)} aria-label="Next">▶</button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick spotlight: offerte del momento (small strip) */}
        {/* Offerte ora mostrate come popup bottom (dismissible) */}

        {/* Recensioni */}
        <section className="testimonial-bleed mb-20 w-screen">
          <div className="testimonial-wrapper">
            <div className="text-center mb-8 px-6 max-w-6xl mx-auto">
              <h2 className="section-title">Cosa dicono i nostri ospiti</h2>
              <p className="section-subtitle">Testimonianze autentiche da Booking.com, Google e Tripadvisor</p>
            </div>

            <div className="relative">
              <div ref={testimonialTrackRef} className="testimonial-track" role="list">
                {testimonials.map((t, idx) => (
                  <div key={t.id} className="testimonial-item" role="listitem">
                    <article
                      role="article"
                      aria-label={`Recensione di ${t.name}`}
                      className="testimonial-card"
                      style={{ transitionDelay: `${idx * 80}ms` }}
                    >
                      <div className="testimonial-header">
                        <img className="testimonial-avatar" src={t.avatar} alt={`Avatar ${t.name}`} />
                        <div>
                          <div className="testimonial-name">{t.name}</div>
                          <div className="testimonial-source">{t.source} · {t.date}</div>
                        </div>
                      </div>

                      <div className="testimonial-stars" aria-hidden>
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <svg key={i} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.847 1.416 8.266L12 19.771 4.584 23.861 6 15.595 0 9.748l8.332-1.73z" />
                          </svg>
                        ))}
                      </div>
                      <span className="sr-only">{t.rating} su 5 stelle</span>

                      <p className="testimonial-quote">{t.text}</p>

                      <div className="testimonial-cta">
                        <a href="#" onClick={(e)=>{e.preventDefault();}} aria-label={`Vedi tutte le recensioni di ${t.name}`}>Leggi tutte le recensioni</a>
                      </div>
                    </article>
                  </div>
                ))}
              </div>

              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 testimonial-controls" aria-hidden>
                <button onClick={() => scrollTestimonial(-1)} aria-label="Scorri indietro">◀</button>
                <button onClick={() => scrollTestimonial(1)} aria-label="Scorri avanti">▶</button>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery (extracted component) */}
        <Gallery />

        {/* Staff */}
        <section className="w-full bg-white py-16 sm:py-20 mb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="section-title">Il nostro team</h2>
              <p className="section-subtitle">Persone appassionate al tuo benessere</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="card p-6 sm:p-8 flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Anna, proprietaria" className="rounded-full w-32 h-32 sm:w-36 sm:h-36 border-4 border-[#bfae82] shadow-lg mb-6 object-cover" />
                <span className="font-bold text-[#4d5c3a] text-2xl sm:text-3xl">Anna</span>
                <span className="text-base text-[#bfae82] font-semibold mb-3">Proprietaria</span>
                <p className="text-[#4d5c3a] text-center leading-relaxed">Accoglienza e cura degli ospiti sono la sua passione.</p>
              </div>
              <div className="card p-6 sm:p-8 flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <img src="https://randomuser.me/api/portraits/men/43.jpg" alt="Luca, chef" className="rounded-full w-32 h-32 sm:w-36 sm:h-36 border-4 border-[#bfae82] shadow-lg mb-6 object-cover" />
                <span className="font-bold text-[#4d5c3a] text-2xl sm:text-3xl">Luca</span>
                <span className="text-base text-[#bfae82] font-semibold mb-3">Chef</span>
                <p className="text-[#4d5c3a] text-center leading-relaxed">Specialità pugliesi e colazioni indimenticabili.</p>
              </div>
              <div className="card p-6 sm:p-8 flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Sara, reception" className="rounded-full w-32 h-32 sm:w-36 sm:h-36 border-4 border-[#bfae82] shadow-lg mb-6 object-cover" />
                <span className="font-bold text-[#4d5c3a] text-2xl sm:text-3xl">Sara</span>
                <span className="text-base text-[#bfae82] font-semibold mb-3">Reception</span>
                <p className="text-[#4d5c3a] text-center leading-relaxed">Sempre pronta a consigliare le migliori escursioni.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Servizi */}
        <section className="w-full bg-gradient-to-b from-[#fbfaf6] to-white py-16 sm:py-20 mb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="section-title">I nostri servizi</h2>
              <p className="section-subtitle">Tutto quello che ti serve per una vacanza perfetta</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="card p-6 sm:p-8 flex flex-col items-center gap-4 transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
                <span className="text-5xl sm:text-6xl">📶</span>
                <span className="font-bold text-[#4d5c3a] text-lg sm:text-xl">WiFi</span>
                <span className="text-sm sm:text-base text-[#4d5c3a] text-center">Connessione veloce gratuita</span>
              </div>
              <div className="card p-6 sm:p-8 flex flex-col items-center gap-4 transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
                <span className="text-5xl sm:text-6xl">🚗</span>
                <span className="font-bold text-[#4d5c3a] text-lg sm:text-xl">Parcheggio</span>
                <span className="text-sm sm:text-base text-[#4d5c3a] text-center">Privato e videosorvegliato</span>
              </div>
              <div className="card p-6 sm:p-8 flex flex-col items-center gap-4 transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
                <span className="text-5xl sm:text-6xl">🛎️</span>
                <span className="font-bold text-[#4d5c3a] text-lg sm:text-xl">Transfer</span>
                <span className="text-sm sm:text-base text-[#4d5c3a] text-center">Navetta da/per aeroporto</span>
              </div>
              <div className="card p-6 sm:p-8 flex flex-col items-center gap-4 transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
                <span className="text-5xl sm:text-6xl">🐾</span>
                <span className="font-bold text-[#4d5c3a] text-lg sm:text-xl">Pet Friendly</span>
                <span className="text-sm sm:text-base text-[#4d5c3a] text-center">Animali ammessi</span>
              </div>
              <div className="card p-6 sm:p-8 flex flex-col items-center gap-4 transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
                <span className="text-5xl sm:text-6xl">🥾</span>
                <span className="font-bold text-[#4d5c3a] text-lg sm:text-xl">Escursioni</span>
                <span className="text-sm sm:text-base text-[#4d5c3a] text-center">Tour guidati tra ulivi e mare</span>
              </div>
              <div className="card p-6 sm:p-8 flex flex-col items-center gap-4 transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
                <span className="text-5xl sm:text-6xl">🚲</span>
                <span className="font-bold text-[#4d5c3a] text-lg sm:text-xl">Biciclette</span>
                <span className="text-sm sm:text-base text-[#4d5c3a] text-center">Noleggio gratuito</span>
              </div>
              <div className="card p-6 sm:p-8 flex flex-col items-center gap-4 transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
                <span className="text-5xl sm:text-6xl">🏊‍♂️</span>
                <span className="font-bold text-[#4d5c3a] text-lg sm:text-xl">Piscina</span>
                <span className="text-sm sm:text-base text-[#4d5c3a] text-center">Piscina panoramica</span>
              </div>
              <div className="card p-6 sm:p-8 flex flex-col items-center gap-4 transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
                <span className="text-5xl sm:text-6xl">💆‍♀️</span>
                <span className="font-bold text-[#4d5c3a] text-lg sm:text-xl">Spa</span>
                <span className="text-sm sm:text-base text-[#4d5c3a] text-center">Area benessere</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full bg-white py-16 sm:py-20 mb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="section-title">Domande frequenti</h2>
              <p className="section-subtitle">Risposte alle domande più comuni</p>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {[
                { q: "Qual è l'orario del check-in e check-out?", a: "Check-in dalle 15:00, check-out entro le 11:00. Possibilità di deposito bagagli." },
                { q: "Accettate animali?", a: "Sì, siamo pet friendly (alcune regole e tariffe possono applicarsi)." },
                { q: "C'è parcheggio?", a: "Sì, parcheggio privato incluso nella struttura." },
              ].map((item, idx) => (
                <AccordionItem key={idx} index={idx} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        </section>
        {/* Newsletter */}
        <Newsletter />
      </main>
      {/* Section: where we are + map */}
      <section className="w-full mb-0">
        <div className="w-full bg-gradient-to-b from-white to-[#fbf9f3] relative py-20">
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
              <h2 className="section-title">Dove siamo</h2>
              <p className="section-subtitle max-w-2xl mx-auto">La nostra posizione nel cuore di Ostuni, tra mare e storia</p>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'B&B La Terrazza', icon: '🏠', address: 'Via Mare 2, Ostuni', distance: '0.4 km', query: 'Via Mare 2 Ostuni' },
                { name: 'Casa degli Ulivi', icon: '🌳', address: 'Piazza Vecchia 5, Ostuni', distance: '0.6 km', query: 'Piazza Vecchia 5 Ostuni' },
                { name: 'Residenza Del Sole', icon: '☀️', address: 'Corso Italia 10, Ostuni', distance: '1.1 km', query: 'Corso Italia 10 Ostuni' },
                { name: 'Trulli & Relax', icon: '🏛️', address: 'Strada Provinciale, Ostuni', distance: '2.3 km', query: 'Strada Provinciale Ostuni' },
              ].map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    // update embedded map, set active card and update overlay with the selected B&B's info
                    setActiveCard(p.name);
                    setMapQuery(p.query);
                    setCurrentPlace({
                      name: p.name,
                      title: p.name,
                      address: p.address + ', Ostuni',
                      details: `${p.distance} · A pochi minuti dal centro`,
                      phone: '+39 080 1234567',
                      query: p.query,
                      distance: p.distance,
                    });
                    // reveal overlay if hidden
                    setMapCardVisible(true);
                    }}
                  aria-pressed={activeCard === p.name}
                  className={`bg-white rounded-lg p-4 shadow-md hover:shadow-lg transform transition hover:-translate-y-1 text-left block border ${activeCard === p.name ? 'border-[#bfae82]' : 'border-[#efe6d6]'} focus:outline-none`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl text-[#bfae82]">{p.icon}</div>
                    <div>
                      <div className="font-semibold text-[#27402b]">{p.name}</div>
                      <div className="text-sm text-[#55664a]">{p.address} · {p.distance}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
  <div className="relative w-full h-[40vh] md:h-[55vh] lg:h-[65vh] overflow-hidden">
          <iframe
            className="absolute inset-0 w-full h-full block"
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            aria-label="Mappa come arrivare"
          ></iframe>

          {/* subtle dark gradient for legibility */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

        {/* Overlay card with address and CTA (responsive & animated) */}
          <div className={`absolute left-1/2 md:left-12 bottom-6 md:bottom-12 -translate-x-1/2 md:translate-x-0 max-w-md transition-all duration-700 ${mapCardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="bg-white/95 backdrop-blur-sm border border-[#ececec] rounded-xl shadow-2xl p-5 md:p-6 w-[min(92vw,360px)]">
              <div className="flex items-start gap-3">
                <div className="text-2xl text-[#bfae82] mt-1">📍</div>
                <div>
                  <h3 className="text-lg font-bold text-[#27402b]">{currentPlace.title}</h3>
                  <p className="text-sm text-[#55664a] mt-1">{currentPlace.address}</p>
                  <p className="text-sm text-[#55664a] mt-2">{currentPlace.details}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMapQuery(currentPlace.query)}
                  className="group transform transition-transform duration-300 group-hover:-rotate-3 group-focus:-rotate-3 inline-flex items-center gap-2 bg-[#4d5c3a] text-white px-3 py-2 rounded-md font-semibold shadow hover:bg-[#3f4f36]"
                >
                  <span className="inline-block transform transition-transform duration-300 group-hover:-rotate-6 group-focus:-rotate-6">Come arrivare</span>
                </button>
                <a href={`tel:${currentPlace.phone.replace(/\s+/g,'')}`} className="inline-flex items-center gap-2 text-[#4d5c3a] px-3 py-2 rounded-md border border-[#e9eee3] hover:bg-[#fffaf0]">📞 {currentPlace.phone}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with embedded Contatti */}
      <footer role="contentinfo" className="w-full bg-[#4d5c3a] text-white border-t border-[#3f4f36] py-16 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
            <div className="md:col-span-1">
              <img src="/logo-beb.png" alt="Logo" className="h-16 w-16 rounded-full border border-white/20 shadow mb-4" />
              <div className="font-bold text-xl text-white">B&B Paradise</div>
              <div className="text-sm text-[#d4c4a8] mt-2">Accoglienza autentica tra ulivi e mare.</div>

              <div className="mt-6">
                <div className="font-semibold text-white text-sm uppercase tracking-wide">Link utili</div>
                <div className="flex flex-col text-sm text-[#d4c4a8] gap-2 mt-3">
                  <a href="/camere" className="hover:text-[#bfae82] transition-colors">Camere</a>
                  <a href="/prenota" className="hover:text-[#bfae82] transition-colors">Prenota</a>
                  <a href="/prenota-pacchetto" className="hover:text-[#bfae82] transition-colors">Pacchetti</a>
                  <a href="#faq" className="hover:text-[#bfae82] transition-colors">FAQ</a>
                </div>
              </div>

              <div className="mt-6 text-sm text-[#d4c4a8]">© 2025 B&B Paradise</div>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Contatti</h4>
              <div className="space-y-4 text-white">
                <div className="flex flex-col">
                  <div className="font-semibold text-white">Indirizzo</div>
                  <div className="text-sm text-[#d4c4a8] mt-1">Via Roma 12, 72017 Ostuni (BR), Italia</div>
                </div>
                <div className="flex flex-col">
                  <div className="font-semibold text-white">Telefono</div>
                  <div><a href="tel:+390801234567" className="font-semibold text-[#bfae82] hover:text-white transition-colors" aria-label="Chiama +39 080 1234567">+39 080 1234567</a></div>
                </div>
                <div className="flex flex-col">
                  <div className="font-semibold text-white">Email</div>
                  <div><a href="mailto:info@bbparadise.it" className="text-sm text-[#d4c4a8] hover:text-[#bfae82] transition-colors" aria-label="Invia una email a info@bbparadise.it">info@bbparadise.it</a></div>
                </div>

                <div>
                  <div className="font-semibold text-white">Orari</div>
                  <div className="text-sm text-[#d4c4a8]">Reception: 08:00 — 22:00 · Check-in 15:00 · Check-out 11:00</div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <a href="#" aria-label="Facebook" className="text-[#d4c4a8] hover:text-[#bfae82] transition-colors" target="_blank" rel="noopener noreferrer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.06 5.66 21.16 10.44 22v-7.03H8.07v-2.9h2.37V9.41c0-2.35 1.4-3.64 3.54-3.64 1.02 0 2.09.18 2.09.18v2.3h-1.18c-1.16 0-1.52.72-1.52 1.46v1.75h2.58l-.41 2.9h-2.17V22C18.34 21.16 22 17.06 22 12.07z" />
                    </svg>
                  </a>
                  <a href="#" aria-label="Instagram" className="text-[#d4c4a8] hover:text-[#bfae82] transition-colors" target="_blank" rel="noopener noreferrer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8" stroke="currentColor" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                  </a>
                  <a href="#" aria-label="Tripadvisor" className="text-[#d4c4a8] hover:text-[#bfae82] transition-colors" target="_blank" rel="noopener noreferrer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM8.5 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM7 15.5c0-1.66 3.59-3 5-3s5 1.34 5 3v.5H7v-.5z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="md:col-span-1">
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Contattaci</h4>
              <form className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20" onSubmit={(e)=>{e.preventDefault(); alert('Grazie! Ti risponderemo presto.');}}>
                <input required type="text" className="w-full px-3 py-2 rounded bg-white/90 border border-white/30 mb-3 text-[#4d5c3a] placeholder-[#8a8f80] focus:outline-none focus:ring-2 focus:ring-[#bfae82]" placeholder="Nome" />
                <input required type="email" className="w-full px-3 py-2 rounded bg-white/90 border border-white/30 mb-3 text-[#4d5c3a] placeholder-[#8a8f80] focus:outline-none focus:ring-2 focus:ring-[#bfae82]" placeholder="Email" />
                <textarea required className="w-full px-3 py-2 rounded bg-white/90 border border-white/30 mb-3 text-[#4d5c3a] placeholder-[#8a8f80] focus:outline-none focus:ring-2 focus:ring-[#bfae82]" rows={3} placeholder="Messaggio"></textarea>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <button type="submit" className="bg-[#bfae82] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a88f5f] transition-all shadow-lg">
                    Invia
                  </button>
                  <a target="_blank" rel="noreferrer noopener" href="https://wa.me/393339876543?text=Vorrei%20prenotare" className="inline-flex items-center gap-2 text-[#bfae82] px-3 py-2 rounded-lg border border-[#bfae82]/30 hover:bg-white/10 transition-all" aria-label="Apri chat WhatsApp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M20.52 3.48A11.94 11.94 0 0 0 12 0C5.373 0 .001 5.373.001 12c0 2.116.554 4.183 1.605 6.004L0 24l6.293-1.629A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12 0-1.64-.31-3.204-.94-4.617zM12 21.5c-1.8 0-3.507-.5-5.003-1.438l-.36-.205-3.738.967.998-3.646-.235-.372A9.5 9.5 0 1 1 21.5 12 9.48 9.48 0 0 1 12 21.5z"/>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.672.15-.198.297-.768.966-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.885-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.148-.173.198-.297.297-.497.099-.198.05-.372-.025-.52-.074-.148-.672-1.612-.92-2.21-.242-.579-.487-.5-.672-.51l-.573-.01c-.198 0-.52.074-.793.372s-1.04 1.016-1.04 2.479 1.064 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487 2.98 1.289 2.98.859 3.516.806.538-.05 1.758-.718 2.006-1.41.248-.69.248-1.28.173-1.41-.074-.13-.272-.198-.57-.347z"/>
                    </svg>
                    <span className="font-semibold text-sm">WhatsApp</span>
                  </a>
                </div>
                <p className="text-xs text-[#d4c4a8] mt-3">I tuoi dati verranno usati solo per contattarti.</p>
              </form>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-8 text-center text-sm text-[#d4c4a8]">
            <span>Powered by Next.js · Design inspired by bed-and-breakfast.it</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
