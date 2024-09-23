import React from "react";
import "../../styles/subcategory.css";
import MotionImage from "@/components/MotionImage";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchData } from "@/utils/fetchData";

export async function generateMetadata({ params }) {
  const { location_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const data = await fetchData(
    `${API_URL}/fetchpagedata?location=${location_slug}&page=pricing-promos`
  );

  const membershipmetadata = data
    ?.filter((item) => item?.path === "pricing-promos")
    ?.map((item) => ({
      title: item?.metatitle?.replace(/windsor|oakville/gi, location_slug),
      description: item?.metadescription?.replace(
        /windsor|oakville/gi,
        location_slug
      ),
    }));

  return {
    title: membershipmetadata[0]?.title,
    description: membershipmetadata[0]?.description,
    alternates: {
      canonical: BASE_URL + "/" + location_slug + "/pricing-promos",
    },
  };
}

const page = async ({ params }) => {
  const { location_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [data, dataconfig] = await Promise.all([
    fetchData(
      `${API_URL}/fetchpagedata?location=${location_slug}&page=pricing-promos`
    ),
    fetchData(
      `${API_URL}/fetchsheetdata?sheetname=config&location=${location_slug}`
    ),
  ]);

  const waiver = dataconfig?.filter((item) => item.key === "waiver");
  const header_image = getDataByParentId(data, "pricing-promos");
  const memberData = getDataByParentId(data, "pricing-promos");

  const pricingheader = dataconfig?.filter(
    (item) => item.key === "pricingheader"
  );
  const filterheadervalue = pricingheader
    .map((item) => item?.value)
    ?.map((value) => value?.split(";"))
    ?.map((splitvalue) => {
      let obj = {};
      splitvalue.forEach((value, index) => {
        obj[`value${index + 1}`] = value;
      });
      return obj;
    });

  const pricing = dataconfig?.filter((item) => item.key === "pricing");
  const filtervalue = pricing
    .map((item) => item?.value)
    ?.map((value) => value?.split(";"))
    ?.map((splitvalue) => {
      let obj = {};
      splitvalue.forEach((value, index) => {
        obj[`value${index + 1}`] = value;
      });
      return obj;
    });

  const mergedArray = filtervalue.map((fv) => {
    const header = filterheadervalue[0];
    return {
      value1: fv.value1,
      [header.value2]: fv.value2,
      [header.value3]: fv.value3,
      [header.value4]: fv.value4,
    };
  });

  console.log(mergedArray);

  return (
    <main>
      <section>
        <MotionImage header_image={header_image} waiver={waiver} />
      </section>
      <section className="aero-max-container">
        <section className="subcategory_main_section">
          <div
            className="pricing_promo_main_section"
            dangerouslySetInnerHTML={{ __html: memberData[0]?.section1 || "" }}
          ></div>

          <section>
            {mergedArray?.map((item, index) => (
              <div className="aero_pricingpromo_card" key={index}>
                <h3 className="aero_pricingpromo_card-heading">Ages</h3>
                <p className="aero_pricingpromo_card-para">{item?.value1}</p>

                <div className="aero_pricingpromo_card-1 d-flex">
                  <div className="aero_pricingpromo_card-2">
                    {Object.keys(filterheadervalue[0])
                      .slice(1)
                      .map((key, keyIndex) => (
                        <h4 key={keyIndex}>{filterheadervalue[0][key]}</h4>
                      ))}
                  </div>

                  <div className="aero_pricingpromo_card-2">
                    {Object.keys(filterheadervalue[0])
                      .slice(1)
                      .map((key, keyIndex) => (
                        <p key={keyIndex}>
                          {item[filterheadervalue[0][key]] || "N/A"}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </section>

          <div
            className="pricing_promo_main_section"
            dangerouslySetInnerHTML={{ __html: memberData[0]?.section2 || "" }}
          ></div>
        </section>
      </section>
    </main>
  );
};

export default page;
