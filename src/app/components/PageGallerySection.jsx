"use client";

import PhotoGallery from "@/components/PhotoGallery";

function hasGalleryContent(galleryData) {
  return Object.values(galleryData || {}).some((groups) =>
    Array.isArray(groups) && groups.some((group) => Array.isArray(group.urls) && group.urls.length > 0)
  );
}

export default function PageGallerySection({ galleryData, heading = "Gallery", className = "" }) {
  if (!hasGalleryContent(galleryData)) return null;

  const navbarTabs = Object.keys(galleryData || {});

  return (
    <section className={`aero-page-gallery-section ${className}`.trim()}>
      <div className="aero-max-container">
        <h2 className="aero-page-gallery-heading">{heading}</h2>
        {navbarTabs.map((navbarName) => (
          <div key={navbarName} className="gallery-navbar-section">
            {navbarTabs.length > 1 && (
              <h3 className="gallery-navbar-title">{navbarName}</h3>
            )}
            <PhotoGallery galleryData={galleryData} navbarName={navbarName} />
          </div>
        ))}
      </div>
    </section>
  );
}
