import React from "react";
import "../styles/kidsparty.css";
import "../styles/subcategory.css";
import MotionImage from "@g2/components/MotionImage";
import { getDataByParentId } from "@g2/utils/customFunctions";
import { fetchsheetdata, fetchPageData, getWaiverLink } from "@g2/lib/sheets";

const Group2Bogo = async ({ params }) => {
  const { location_slug } = params;
  const waiverLink = await getWaiverLink(location_slug);
  const [data, dataconfig] = await Promise.all([
    fetchPageData(location_slug, 'bogo'),
    fetchsheetdata('config', location_slug),

  ]);

  // fetchPageData returns the bogo page object (same shape membership/category
  // consume). Guard so a missing bogo page renders empty instead of throwing.
  const pageData = data || {};

  return (
    <main>
      <section>
        <MotionImage pageData={pageData} waiverLink={waiverLink} />
      </section>
      <section className="subcategory_main_section-bg">
        <section className="aero-max-container">
          <div
            className="bogo_main_section"
            dangerouslySetInnerHTML={{ __html: pageData?.section1 || "" }}
          ></div>
        </section>
      </section>
    </main>
  );
};

export default Group2Bogo;
