import Image from "next/image";

import Link from "next/link";
import "./styles.css";
import logo_white from "@public/assets/images/city/logo_white.png";
import { fetchData } from "./utils/fetchData";

export default async function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const FetchLocation = await fetchData(
    `${apiUrl}/fetchsheetdata?sheetname=locations`
  );
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
                />
                <h2>{card.desc}</h2>
                <p>{card.address}</p>
                <a href={`/${card.locations}`}>
                  <button>
                    <span>SELECT THIS PARK</span>
                  </button>
                </a>
                {/* <LocationButton location={card.locations} /> */}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
