import '../styles/gallery.css';
import React from "react";
import { fetchGalleryData, fetchsheetdata, generateSchema } from "@g2/lib/sheets";
import PhotoGallery from "@g2/components/PhotoGallery";

const Group2Gallery = async ({ params }) => {
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

export default Group2Gallery;
