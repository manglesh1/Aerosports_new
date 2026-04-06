import '../../styles/gallery.css';
import React from "react";
import { fetchGalleryData, fetchsheetdata, generateMetadataLib, generateSchema } from "@/lib/sheets";
import PhotoGallery from "@/components/PhotoGallery";

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: '',
    page: 'gallery'
  });

  return {
    ...metadata,
    title: `Photo Gallery - ${params.location_slug} | AeroSports`,
    description: `Browse photos and videos from AeroSports ${params.location_slug} location. See our attractions, events, and happy customers in action!`
  };
}

const GalleryPage = async ({ params }) => {
  const location_slug = params?.location_slug;

  // Fetch gallery data and location data in parallel
  const [galleryData, locationData] = await Promise.all([
    fetchGalleryData(location_slug),
    fetchsheetdata('locations', location_slug),
  ]);

  // Get all navbar values from galleryData
  const navbarTabs = Object.keys(galleryData);

  return (
    <main className="aero-gallery-main-section">
      <section className="aero-max-container">
        <h1 className="aero-gallery-main-heading">Photo & Video Gallery</h1>
        <p className="aero-gallery-description">
          Explore our collection of photos and videos from AeroSports {location_slug}.
        </p>

        {navbarTabs.length > 0 ? (
          navbarTabs.map((navbarName) => (
            <div key={navbarName} className="gallery-navbar-section">
              {navbarTabs.length > 1 && (
                <h2 className="gallery-navbar-title">{navbarName}</h2>
              )}
              <PhotoGallery galleryData={galleryData} navbarName={navbarName} />
            </div>
          ))
        ) : (
          <div className="gallery-empty-state">
            <p>No gallery content available yet. Check back soon!</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default GalleryPage;
