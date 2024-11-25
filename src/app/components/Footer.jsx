import Image from "next/image";
import "../styles/home.css";
import event_icon from "@public/assets/images/home/event_icon.svg";
import park_feature_icon from "@public/assets/images/home/park_feature_icon.svg";
import jump_icon from "@public/assets/images/home/jump_icon.svg";
import Link from "next/link";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchData } from "@/utils/fetchData";
import RatingComponent from "./smallComponents/RatingComponent";
import facebookicon from "@public/assets/images/social_icon/facebook.png";
import twittericon from "@public/assets/images/social_icon/twitter.png";
import tiktokicon from "@public/assets/images/social_icon/tiktok.png";
import instagramicon from "@public/assets/images/social_icon/instagram.png";
import Script from "next/script";

const Footer = async ({ location_slug }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const configdata = await fetchData(
    `${API_URL}/fetchsheetdata?sheetname=locations_new&location=${location_slug}`
  );

  const {
    locationid,
    facebook,
    insta,
    twitter,
    tiktok,
    chatid,
  } = configdata[0] || {};

  const [data, ratingdata] = await Promise.all([
    fetchData(`${API_URL}/fetchmenudata?location=${location_slug}`),
    fetchData(`${API_URL}/getreviews?locationid=${locationid}`),
  ]);

  const attractionsData = getDataByParentId(data, "attractions");
  const programsData = getDataByParentId(data, "programs");
  const groupsData = getDataByParentId(data, "groups-events");
  const companyData = getDataByParentId(data, "aboutus");
  const blogsData = getDataByParentId(data, "blogs");

  return (
    <footer className="aero_footer_section-bg">
      <section className="aero_home-headerimg-wrapper">
        <Image
          src="https://storage.googleapis.com/aerosports/windsor/GLOW-2-h.jpg"
          alt="Glow Night Event"
          width={1200}
          height={600}
          title="Glow Night Event"
        />
        <article className="aero-max-container aero_home_BPJ_wrapper">
          {[
            { icon: event_icon, text: "Birthday Parties" },
            { icon: park_feature_icon, text: "Park Features" },
            { icon: jump_icon, text: "Safe Jumping" },
          ].map((item, index) => (
            <div className="d-flex-center" key={index}>
              <Image src={item.icon} width={90} height={80} alt={item.text} />
              <span>{item.text}</span>
            </div>
          ))}
        </article>
      </section>

      <section className="aero-max-container">
        <RatingComponent ratingdata={ratingdata} />
        <div className="d-flex-center aero_logo_social_wrap">
          <Link href={`/${location_slug}`}>
            <Image
              src="https://storage.googleapis.com/aerosports/logo_white.png"
              alt="AeroSports Logo"
              width={100}
              height={93.42}
            />
          </Link>
          <div className="aero_social_icon_wrap">
            {facebook && (
              <Link
                href={`https://www.facebook.com/${facebook}`}
                target="_blank"
                className="aero_social_icon"
              >
                <Image
                  src={facebookicon}
                  alt="Facebook"
                  height={50}
                  width={50}
                />
              </Link>
            )}
            {twitter && (
              <Link
                href={`https://x.com/${twitter}`}
                target="_blank"
                className="aero_social_icon"
              >
                <Image src={twittericon} alt="Twitter" height={50} width={50} />
              </Link>
            )}
            {insta && (
              <Link
                href={`https://www.instagram.com/${insta}`}
                target="_blank"
                className="aero_social_icon"
              >
                <Image
                  src={instagramicon}
                  alt="Instagram"
                  height={50}
                  width={50}
                />
              </Link>
            )}
            {tiktok && (
              <Link
                href={`https://www.tiktok.com/${tiktok}`}
                target="_blank"
                className="aero_social_icon"
              >
                <Image src={tiktokicon} alt="TikTok" height={50} width={50} />
              </Link>
            )}
          </div>
        </div>
        <section className="aero_footer_col-4-wrapper">
          <ul>
            <li>Attractions</li>
            {attractionsData[0]?.children?.map((item, i) => {
              return (
                <li key={i}>
                  <Link
                    href={`/${location_slug}/${item?.parentid}/${item?.path}`}
                  >
                    {item?.desc}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul>
            <li>Programs</li>
            {programsData[0]?.children?.map((item, i) => {
              return (
                <li key={i}>
                  <Link
                    href={`/${location_slug}/${item?.parentid}/${item?.path}`}
                  >
                    {item?.desc}
                  </Link>
                </li>
              );
            })}

            {companyData[0]?.children?.length > 0 && (
              <ul>
                <li>Company</li>
                {companyData[0]?.children?.map((item, i) => {
                  return (
                    item?.isactive == 1 && (
                      <li key={i}>
                        <Link
                          href={`/${location_slug}/${item?.parentid}/${item?.path}`}
                        >
                          {item?.desc}
                        </Link>
                      </li>
                    )
                  );
                })}
              </ul>
            )}
          </ul>
          <ul>
            <li>Groups</li>
            {groupsData[0]?.children?.map((item, i) => {
              return (
                <li key={i}>
                  <Link
                    href={`/${location_slug}/${item?.parentid}/${item?.path}`}
                  >
                    {item?.desc}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul>
            <li>Latest News</li>
            {blogsData[0]?.children &&
              blogsData[0]?.children.map((item, i) => {
                return (
                  <li key={i}>
                    <Link
                      href={`/${location_slug}/${item?.parentid}/${item?.path}`}
                    >
                      <article className="d-flex-center aero_footer_article-card">
                        <Image
                          src={item?.smallimage}
                          alt={item?.title}
                          title={item?.title}
                          width={50}
                          height={50}
                        />
                        <div>
                          <h6>{item?.pageid}</h6>
                          <p>{item?.title}</p>
                        </div>
                      </article>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </section>
      </section>

      {/* Chat Widget Script */}
      <Script
        src="https://widgets.leadconnectorhq.com/loader.js"
        data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
        data-widget-id={chatid}
        strategy="afterInteractive"
      />
    </footer>
  );
};

export default Footer;
