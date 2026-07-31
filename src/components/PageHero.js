export default function PageHero({ eyebrow, title, description, aside }) {
  return (
    <section className="page-hero">
      <div className="container page-hero__grid">
        <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>
        {aside && <div className="page-hero__aside">{aside}</div>}
      </div>
    </section>
  );
}
