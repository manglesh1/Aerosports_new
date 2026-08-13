import '../../styles/gallery.css';
import React from "react";
import { fetchGalleryData, fetchPageData, fetchsheetdata, generateMetadataLib, generateSchema } from "@/lib/sheets";
import PhotoGallery from "@/components/PhotoGallery";

import { resolveLocationGroup } from "@/lib/location-groups.mjs";
import Group2Gallery from "@g2/pages/Group2Gallery";
import { generateMetadataLib as generateMetadataLibG2 } from "@g2/lib/sheets";

const isGroup2 = (slug) => resolveLocationGroup(slug)?.group?.key === "group2";

export async function generateMetadata({ params }) {
  if (isGroup2(params.location_slug)) {
    const metadata = await generateMetadataLibG2({
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
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: '',
    page: 'gallery'
  });

  return metadata;
}

const GalleryPage = async ({ params }) => {
  if (isGroup2(params?.location_slug)) return <Group2Gallery params={params} />;

  const location_slug = params?.location_slug;

  // Fetch gallery data and location data in parallel
  const [galleryData, locationData, pageData] = await Promise.all([
    fetchGalleryData(location_slug),
    fetchsheetdata('locations', location_slug),
    fetchPageData(location_slug, "gallery"),
  ]);

  // Get all navbar values from galleryData
  const navbarTabs = Object.keys(galleryData);

  return (
    <main className="aero-gallery-main-section">
      <section className="aero-max-container">
        <h1 className="aero-gallery-main-heading">{pageData?.title || "Photo & Video Gallery"}</h1>
        <p className="aero-gallery-description">
          {pageData?.smalltext || pageData?.metadescription || `Explore our collection of photos and videos from AeroSports ${location_slug}.`}
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
