import React from "react";
import "../../styles/kidsparty.css";
import "../../styles/subcategory.css";
import { generateMetadataLib } from "@/lib/sheets";

import MembershipPage from "@/components/membership/MembershipPage";

import { resolveLocationGroup } from "@/lib/location-groups.mjs";
import Group2Membership from "@g2/pages/Group2Membership";
import { generateMetadataLib as generateMetadataLibG2 } from "@g2/lib/sheets";

const isGroup2 = (slug) => resolveLocationGroup(slug)?.group?.key === "group2";

export async function generateMetadata({ params }) {
  if (isGroup2(params.location_slug)) {
    return await generateMetadataLibG2({
      location: params.location_slug,
      category: '',
      page: 'membership'
    });
  }
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: '',
    page: 'membership'
  });
  return metadata;
}



const page = async ({ params }) => {
  if (isGroup2(params?.location_slug)) return <Group2Membership params={params} />;

  return <MembershipPage params={params} />;
};

export default page;
