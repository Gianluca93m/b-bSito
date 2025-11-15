"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80', alt: 'Camera Deluxe' },
  { src: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1400&q=80', alt: 'Piscina' },
  { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80', alt: 'Colazione' },
  { src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1400&q=80', alt: 'Esterni' },
  { src: 'https://images.unsplash.com/photo-1505691723518-36a5f3d8d5c4?auto=format&fit=crop&w=1400&q=80', alt: 'Sala' },
  { src: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80', alt: 'Vista' },
];

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setLightboxOpen(false);
      if (e.key === "ArrowRight") return setActiveIndex((i) => (i + 1) % galleryImages.length);
      if (e.key === "ArrowLeft") return setActiveIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  return (
    <section className="w-full mb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title">Galleria</h2>
          <p className="section-subtitle">Scopri gli spazi e le camere del nostro B&B</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((img, i) => (
            <button
              key={img.src}
              onClick={() => { setActiveIndex(i); setLightboxOpen(true); }}
              className="relative group rounded-lg overflow-hidden shadow-lg border border-[#ececec] p-0 block h-80"
              aria-label={`Apri immagine ${img.alt}`}
            >
              <div className="relative w-full h-full">
                <Image src={img.src} alt={img.alt} fill className="object-cover w-full h-full transform group-hover:scale-102 transition" loading="lazy" unoptimized placeholder="empty" />
              </div>
              <span className="absolute bottom-4 left-4 bg-[#bfae82] text-white text-sm px-3 py-1 rounded-md shadow">{img.alt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setLightboxOpen(false)}>
          <div className="relative max-w-[90vw] max-h-[90vh] w-[90vw] h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <button aria-label="Chiudi" className="absolute -top-6 -right-6 bg-white text-[#4d5c3a] rounded-full p-2 shadow-lg" onClick={() => setLightboxOpen(false)}>✕</button>
            <button aria-label="Immagine precedente" onClick={() => setActiveIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 text-[#4d5c3a] rounded-full p-2 shadow">◀</button>
            <button aria-label="Immagine successiva" onClick={() => setActiveIndex((i) => (i + 1) % galleryImages.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 text-[#4d5c3a] rounded-full p-2 shadow">▶</button>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image src={galleryImages[activeIndex].src} alt={galleryImages[activeIndex].alt} fill className="object-contain rounded-lg" unoptimized placeholder="empty" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
