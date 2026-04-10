// "Why AeroSports" section. Content is identical for every location, so it's
// hardcoded. The headline interpolates the display name.
const CARDS = [
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Family-Friendly",
    text: "Dedicated toddler zones, Toddler Time on Saturdays, and programming that works for ages 2 to adult.",
  },
  {
    icon: "🛡️",
    title: "Safety First",
    text: "Professional supervision, padded equipment, safety briefings, and required grip socks for every jumper.",
  },
  {
    icon: "💪",
    title: "Fitness Focused",
    text: "Trampoline exercise burns calories while feeling like pure fun — physical activity that kids beg for.",
  },
  {
    icon: "🎮",
    title: "Always Something New",
    text: "Seasonal glow nights, themed events and new attractions keep every visit fresh.",
  },
];

const WhyChooseV2 = ({ locationDisplay }) => {
  return (
    <section className="hv2-why" id="why">
      <div className="hv2-why-bg" />
      <div className="hv2-why-inner">
        <div className="hv2-why-header">
          <div className="hv2-section-tag">Why AeroSports</div>
          <h2 className="hv2-why-h2">
            {locationDisplay ? `${locationDisplay}'s Ultimate Play Destination` : "Your Ultimate Play Destination"}
          </h2>
        </div>
        <div className="hv2-why-grid">
          {CARDS.map((c, i) => (
            <div className="hv2-why-card" key={i}>
              <div className="hv2-why-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseV2;
