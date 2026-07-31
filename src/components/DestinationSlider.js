import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Map } from 'lucide-react';
import DestinationCard from './DestinationCard';
import { useI18n } from '../i18n';

const GAP = 16;
const AUTOPLAY_MS = 15000;

export default function DestinationSlider({ destinations, note }) {
  const trackRef = useRef(null);
  const { t } = useI18n();
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [paused, setPaused] = useState(false);
  // Bumping this restarts the autoplay timer, so a manual slide gets a full interval.
  const [restart, setRestart] = useState(0);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [sync]);

  const slide = useCallback((direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild;
    const step = card ? card.offsetWidth + GAP : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  }, []);

  const nudge = (direction) => {
    slide(direction);
    setRestart((count) => count + 1);
  };

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = setInterval(() => {
      const track = trackRef.current;
      if (!track || document.hidden) return;
      const max = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= max - 4) track.scrollTo({ left: 0, behavior: 'smooth' });
      else slide(1);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, slide, restart]);

  return (
    <div className="destination-slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="slider-bar">
        <div className="hand-note"><Map size={19} aria-hidden="true" /> {note}</div>
        <div className="slider-nav">
          <button type="button" className="slider-nav__button" onClick={() => nudge(-1)} disabled={atStart} aria-label={t('destinations.previous')}><ChevronLeft size={20} aria-hidden="true" /></button>
          <button type="button" className="slider-nav__button" onClick={() => nudge(1)} disabled={atEnd} aria-label={t('destinations.next')}><ChevronRight size={20} aria-hidden="true" /></button>
        </div>
      </div>
      <div className="destination-track" ref={trackRef} onScroll={sync}>{destinations.map((destination) => <DestinationCard key={destination.id} destination={destination} />)}</div>
    </div>
  );
}
