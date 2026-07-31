import { Quote } from 'lucide-react';
import { useI18n } from '../i18n';

export default function TestimonialCard({ testimonial }) {
  const { t } = useI18n();

  return (
    <blockquote className="testimonial-card">
      <Quote size={28} aria-hidden="true" />
      <p>“{t(`testimonials.${testimonial.id}.quote`)}”</p>
      <footer><strong>{t(`testimonials.${testimonial.id}.name`)}</strong><span>{t(`testimonials.${testimonial.id}.trip`)}</span></footer>
    </blockquote>
  );
}
