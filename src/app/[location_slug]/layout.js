import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function LocationLayout({ children, params }) {
  const location_slug = params?.location_slug;
  return (
    <div>
      <Header location_slug={location_slug} />
      {children}
      <Footer location_slug={location_slug} />
      <div id="modal-root"></div>
    </div>
  );
}
