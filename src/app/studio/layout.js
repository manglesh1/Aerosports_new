import "./studio.css";

export const metadata = {
  title: "AeroSports Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }) {
  return <div className="studio">{children}</div>;
}
