const fs = require('fs');
const path = require('path');

const root = process.cwd();
const pageFile = path.join(root, 'src/app/page.jsx');
const text = fs.readFileSync(pageFile, 'utf8');

const sectionTitle = 'Choose Your Experience';
const titleIndex = text.indexOf(sectionTitle);
if (titleIndex === -1) {
  throw new Error(`Could not find section title: ${sectionTitle}`);
}

const blockStart = text.lastIndexOf('<section className="hv2-plan"', titleIndex);
const nextSection = text.indexOf('{/*', titleIndex + sectionTitle.length);
const sectionEnd = text.lastIndexOf('</section>', nextSection) + '</section>'.length;

if (blockStart === -1 || nextSection === -1 || sectionEnd === -1) {
  throw new Error('Could not locate full Choose Your Experience section.');
}

const replacement = `      <section className="hv2-plan hv2-experience-photo-section">
        <div className="hv2-experience-photo-inner">
          <div className="hv2-experience-photo-header">
            <span className="hv2-section-tag">Start Here</span>
            <h2 className="hv2-why-h2">Choose Your Experience</h2>
          </div>

          <div className="hv2-experience-photo-grid">
            {[
              {
                title: "Birthday Parties",
                desc: "Stress-free celebrations with private rooms and party hosts.",
                href: "#parties",
                image: "https://media.aerosportsparks.ca/home-experience/birthday-parties.webp",
              },
              {
                title: "Gallery",
                desc: "See real park moments, smiles, and action from AeroSports.",
                href: "#gallery",
                image: "https://media.aerosportsparks.ca/home-experience/gallery.webp",
              },
              {
                title: "Group Events",
                desc: "Bring the crew for school trips, team days, and group fun.",
                href: "#groups",
                image: "https://media.aerosportsparks.ca/home-experience/group-events.webp",
              },
            ].map((e) => (
              <a key={e.title} href={e.href} className="hv2-experience-photo-card">
                <AppImage
                  src={e.image}
                  alt={e.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="hv2-experience-photo-img"
                />
                <span className="hv2-experience-photo-shade" />
                <span className="hv2-experience-photo-glow" />
                <span className="hv2-experience-photo-content">
                  <span className="hv2-experience-photo-title">{e.title}</span>
                  <span className="hv2-experience-photo-desc">{e.desc}</span>
                  <span className="hv2-experience-photo-link">Explore -&gt;</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>`;

const updated = text.slice(0, blockStart) + replacement + '\n\n      ' + text.slice(nextSection);
fs.writeFileSync(pageFile, updated, 'utf8');
console.log('Updated Choose Your Experience photo cards in src/app/page.jsx');
