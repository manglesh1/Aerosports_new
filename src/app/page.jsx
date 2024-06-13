"use client";

import Image from "next/image";
import Link from "next/link";
import "./styles.css";
import logo_white from "@public/assets/images/city/logo_white.png";
import oakville from "@public/assets/images/city/Mississauga-Oakville.webp";
import catherines from "@public/assets/images/city/st.-catherines.webp";
import london from "@public/assets/images/city/london.webp";
import windsor from "@public/assets/images/city/windsor.webp";
import { useEffect, useState } from "react";

const cityCard = [
  {
    id: 1,
    cityimage: oakville,
    cityname: "Mississauga- Oakville",
    cityphone: "905-829-2989",
    cityaddress: "2679 Bristol Cir, Oakville, ON L6H 6Z8",
    slug_url: "oakville",
  },
  {
    id: 2,
    cityimage: catherines,
    cityname: "St. Catharines",
    cityphone: "289-362-3377",
    cityaddress: "333 Ontario St, St. Catharines, ON L2R 5L3",
    slug_url: "st-catharines",
  },
  {
    id: 3,
    cityimage: london,
    cityname: "London ON",
    cityphone: "519-914-9663",
    cityaddress: "784 Wharncliffe Rd S, London, ON N6J 2N4",
    slug_url: "london",
  },
  {
    id: 4,
    cityimage: windsor,
    cityname: "Windsor ON",
    cityphone: "519-916-9663",
    cityaddress: "7654 Tecumseh Rd E, Windsor, ON N8T 1E9",
    slug_url: "windsor",
  },
];

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/csvReader/locations`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) return <div>Failed to load: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  console.log(data);
  return (
    <main className="aero-bg">
      <section className="aero-max-container aero-bg-padding">
        <div className="aero-img-heading">
          <Image src={logo_white} alt="logo" />
          <h1 className="city-card-h1-heading">ONE PASS MORE FUN</h1>
        </div>

        <div className="city-card-wrapper">
          {data.map((card, i) => {
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
                <Link href={`/home/${card.locations}`}>
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
