import React from "react";
import "../../styles/subcategory.css";
import MotionImage from "@/components/MotionImage";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchsheetdata, generateMetadataLib,getWaiverLink,generateSchema } from "@/lib/sheets";

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: '',
    page: 'membership'
  });
  return metadata;
}



const page = async ({ params }) => {
  const { location_slug } = params;
  
  const [data,waiverLink, locationData] = await Promise.all([
    fetchsheetdata('Data',location_slug),getWaiverLink(location_slug),
     fetchsheetdata('locations',location_slug)
    
    
  ]);
 
    
  const memberData = getDataByParentId(data, "membership");
const jsonLDschema = await generateSchema(memberData,locationData,'',"membership");
  return (
    <main>
      <section>
        <MotionImage pageData={memberData}  waiverLink={waiverLink} locationData={locationData} />
      </section>
      <section className="subcategory_main_section-bg">
        <section className="aero-max-container">
          <div
            className="subcategory_main_section"
            dangerouslySetInnerHTML={{ __html: memberData[0]?.section1 || "" }}
          ></div>
        </section>
      </section>
    <script type="application/ld+json" suppressHydrationWarning
  dangerouslySetInnerHTML={{ __html: jsonLDschema }}
/>
    </main>
  );
};

export default page;
