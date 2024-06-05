import Image from "next/image";
import Link from "next/link";
import "./styles.css";
import logo_white from "@public/assets/images/city/logo_white.png";
import oakville from "@public/assets/images/city/Mississauga-Oakville.webp";
import catherines from "@public/assets/images/city/st.-catherines.webp";
import london from "@public/assets/images/city/london.webp";
import windsor from "@public/assets/images/city/windsor.webp";

const cityCard = [
  {
    id: 1,
    cityimage: oakville,
    cityname: "Mississauga- Oakville",
    cityphone: "905-829-2989",
    cityaddress: "2679 Bristol Cir, Oakville, ON L6H 6Z8",
    slug_url: "Mississauga-Oakville",
  },
  {
    id: 2,
    cityimage: catherines,
    cityname: "St. Catharines",
    cityphone: "289-362-3377",
    cityaddress: "333 Ontario St, St. Catharines, ON L2R 5L3",
    slug_url: "St-Catharines",
  },
  {
    id: 3,
    cityimage: london,
    cityname: "London ON",
    cityphone: "519-914-9663",
    cityaddress: "784 Wharncliffe Rd S, London, ON N6J 2N4",
    slug_url: "London-ON",
  },
  {
    id: 4,
    cityimage: windsor,
    cityname: "Windsor ON",
    cityphone: "519-916-9663",
    cityaddress: "7654 Tecumseh Rd E, Windsor, ON N8T 1E9",
    slug_url: "Windsor-ON",
  },
];

export default function Home() {
  return (
    <main className="aero-bg">
      <section className="aero-bg-padding">
        <div className="aero-img-heading">
          <Image src={logo_white} alt="logo" />
          <h1 className="city-card-h1-heading">ONE PASS MORE FUN</h1>
        </div>

        <div className="city-card-wrapper">
          {cityCard.map((card) => {
            return (
              <div className="city-card-wrap" key={card.id}>
                <Image src={card.cityimage} alt="city image" />
                <h2>{card.cityname}</h2>
                <p>{card.cityaddress}</p>
                <Link href={`/home/${card.slug_url}`}>
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
