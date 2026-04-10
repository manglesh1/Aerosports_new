// "Why AeroSports" section. Content is identical for every location, so it's
// hardcoded. The headline interpolates the display name.
const CARDS = [
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Family-Friendly",
    text: "Dedicated toddler zones, comfortable parent areas, and programming for ages 2 to adult — everyone belongs here.",
  },
  {
    icon: "🛡️",
    title: "Safety First",
    text: "Certified trained staff, padded equipment, safety briefings, and required grip socks — your kids are in good hands.",
  },
  {
    icon: "🎉",
    title: "Stress-Free Birthdays",
    text: "Dedicated party hosts, private rooms, and all-inclusive packages — 50,000+ parties hosted and counting.",
  },
  {
    icon: "🎯",
    title: "Everything Under One Roof",
    text: "Trampolines, ninja courses, dodgeball, foam pits and more — endless variety keeps every visit fresh.",
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
            {locationDisplay ? `Why Families Choose AeroSports in ${locationDisplay}` : "Why Families Choose AeroSports"}
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
