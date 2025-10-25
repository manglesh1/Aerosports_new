import Image from "next/image";

import Link from "next/link";
import "./styles.css";
import logo_white from "@public/assets/images/city/logo_white.png";

import { fetchsheetdata } from "./lib/sheets";
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
              <Link href={`/${card.locations}`} prefetch key={i}>
                <article className="city-card-wrap">
                  <div className="city-card-image-wrap">
                    <img
                      src={card.smallimage}
                      alt={card.desc}
                      className="city-card-image"
                      loading="lazy"
                    />
                    <div className="city-card-image-overlay"></div>
                  </div>
                  <div className="city-card-content">
                    <h2 className="city-card-title">{card.desc}</h2>
                    <div className="city-card-info-row">
                      <div className="city-card-info-item">
                        <svg
                          className="city-card-icon"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="city-card-text">{card.address}</span>
                      </div>
                      {card.phone && (
                        <div className="city-card-info-item">
                          <svg
                            className="city-card-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <span className="city-card-text">{card.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="city-card-cta">SELECT THIS PARK</div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
