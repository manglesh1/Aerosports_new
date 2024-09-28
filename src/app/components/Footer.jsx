import Image from "next/image";
import "../styles/home.css";
import event_icon from "@public/assets/images/home/event_icon.svg";
import park_feature_icon from "@public/assets/images/home/park_feature_icon.svg";
import jump_icon from "@public/assets/images/home/jump_icon.svg";
import Link from "next/link";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchData } from "@/utils/fetchData";
import RatingComponent from "./smallComponents/RatingComponent";
import { RiFacebookFill } from "react-icons/ri";
import { BiLogoTwitter } from "react-icons/bi";
import { GrInstagram } from "react-icons/gr";
import { FaTiktok } from "react-icons/fa6";

const Footer = async ({ location_slug }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const configdata = await fetchData( `${API_URL}/fetchsheetdata?sheetname=locations_new&location=${location_slug}`);

  const locationid = configdata.map(item => item.locationid);
  const facebook = configdata.map(item => item.facebook);
  const insta = configdata.map(item => item.insta);
  const twitter = configdata.map(item => item.twitter);
  const tiktok = configdata.map(item => item.tiktok);

  const [data, ratingdata] = await Promise.all([
    fetchData(`${API_URL}/fetchmenudata?location=${location_slug}`),
    fetchData(`${API_URL}/getreviews?locationid=${locationid[0]}`),
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
          alt="header - image"
          width={1200}
          height={600}
          title="site image"
        />
        <article className="aero-max-container aero_home_BPJ_wrapper">
          <div className="d-flex-center">
            <Image src={event_icon} width={90} height={80} alt="img" />
            <span>Birthday Parties</span>
          </div>
          <div className="d-flex-center">
            <Image src={park_feature_icon} width={90} height={80} alt="img" />
            <span>Park Features</span>
          </div>
          <div className="d-flex-center">
            <Image src={jump_icon} width={90} height={80} alt="img" />
            <span>Safe Jumping</span>
          </div>
        </article>
      </section>
      <section className="aero-max-container">
        <RatingComponent ratingdata={ratingdata}/>
        <div className="d-flex-center aero_logo_social_wrap">
          <Link href={`/${location_slug}`}>
            <Image
              src="https://storage.googleapis.com/aerosports/logo_white.png"
              alt="footer logo"
              width={100}
              height={93.42}
            />
          </Link>
          <div className="aero_social_icon_wrap">
            { facebook[0] &&  <Link href={`https://www.facebook.com/${facebook[0]}`} target="_blank" className="aero_social_icon"><RiFacebookFill /></Link>}
            { twitter[0] &&  <Link href={`https://x.com/${twitter[0]}`} target="_blank" className="aero_social_icon"><BiLogoTwitter /></Link>}
            { insta[0] &&  <Link href={`https://www.instagram.com/${insta[0]}`} target="_blank" className="aero_social_icon"><GrInstagram /></Link>}
            { tiktok[0] &&  <Link href={`https://www.tiktok.com/${tiktok[0]}`} target="_blank" className="aero_social_icon"><FaTiktok /></Link>}
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
                          <h6>{item?.path}</h6>
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
    </footer>
  );
};

export default Footer;
