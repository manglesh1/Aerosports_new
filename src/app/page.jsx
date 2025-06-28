import Image from "next/image";

import Link from "next/link";
import "./styles.css";
import logo_white from "@public/assets/images/city/logo_white.png";
import { fetchData } from "./utils/fetchData";
import { fetchsheetdata, fetchMenuData, fetchPageData } from "./lib/sheets";
export default async function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const FetchLocation =  await fetchsheetdata('locations');
   
  return (
    
    <main className="aero-bg">
     
      <section className="aero-max-container aero-bg-padding">
        <div className="aero-img-heading">
          <Image src={logo_white} alt="logo" />
          <h1 className="city-card-h1-heading">ONE PASS MORE FUN</h1>
        </div>

        <div className="city-card-wrapper">
          {FetchLocation.map((card, i) => {
            return (
              <div className="city-card-wrap" key={i}>
                <Image
                  src={card.smallimage}
                  alt="city image"
                  width={100}
                  height={100}
                  unoptimized
                />
                <h2>{card.desc}</h2>
                <p>{card.address}</p>
                <Link href={`/${card.locations}`} prefetch>
                  <button>
                    <span>SELECT THIS PARK</span>
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
