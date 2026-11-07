import { spaces } from "./site";

/**
 * Our spaces — three catalogue cards (The Grand Hall, The Nooks, Study
 * Desks), each with its own line-drawn illustration.
 */
export function Spaces() {
  return (
    <section className="content-section" id="spaces">
      <div className="section-heading">
        <div>
          <span className="eyebrow">01 &nbsp;/&nbsp; FIND YOUR PLACE</span>
          <h2>
            A little space
            <br />
            to be yourself.
          </h2>
        </div>
        <p>
          Come with a novel, a textbook, or a project that needs your focus.
          The right kind of room makes all the difference.
        </p>
      </div>
      <div className="space-grid">
        {spaces.map((space) => (
          <article className="space-card" key={space.index}>
            <span className="space-index">
              {space.index} / {space.label}
            </span>
            <div className="space-illustration" aria-hidden="true" />
            <div>
              <h3>{space.name}</h3>
              <p>{space.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
