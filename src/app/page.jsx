import Image from "next/image";
import Link from "next/link";
import logo_white from "@public/assets/images/city/logo_white.png";
import { Button } from "./components/ui/button";
import { fetchsheetdata } from "./lib/sheets";

export default async function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const FetchLocation = await fetchsheetdata("locations");

  return (
    <main className="before:z-0 before:absolute relative before:inset-0 before:bg-[radial-gradient(circle_at_20%_30%,rgba(240,12,116,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(202,255,26,0.1)_0%,transparent_50%)] bg-linear-to-br from-black via-[#1a1a1a] to-black min-h-screen overflow-hidden before:pointer-events-none">
      <section className="z-10 relative px-4 md:px-8 py-4 md:py-8 pb-12">
        <div className="mb-5 lg:mb-12">
          <Image src={logo_white} alt="logo" className="w-auto h-[100px]" />
          <h1 className="bg-clip-text bg-linear-to-r from-[#ff1152] to-[#caff1a] font-black text-transparent text-4xl text-center uppercase tracking-wide">
            ONE PASS MORE FUN
          </h1>
        </div>

        <div className="gap-6 md:gap-6 lg:gap-5 2xl:gap-8 xl:gap-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mx-auto px-2 md:px-4 lg:px-6 2xl:px-8 xl:px-8 py-4 md:py-8 lg:py-10 2xl:py-12 xl:py-12 max-w-[2000px]">
          {FetchLocation.map((card, i) => {
            return (
              <Link
                href={`/${card.locations}`}
                prefetch
                key={i}
                className="group flex opacity-0 h-full animate-[cardFadeIn_0.6s_ease_forwards]"
                style={{ animationDelay: `${(i % 6) * 0.1}s` }}
              >
                <article className="relative flex flex-col bg-linear-to-br from-black/80 to-[#1a1a1a]/60 shadow-[0_10px_30px_rgba(240,12,116,0.3),0_0_0_2px_rgba(240,12,116,0.2)] hover:shadow-[0_20px_50px_rgba(240,12,116,0.5),0_0_60px_rgba(202,255,26,0.4)] rounded-[20px] w-full h-full overflow-hidden hover:scale-[1.03] transition-all hover:-translate-y-2.5 duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,20px_100%,0_calc(100%-20px))]">
                  <div className="relative w-full h-[220px] md:h-60 lg:h-[260px] 2xl:h-80 xl:h-[280px] overflow-hidden shrink-0">
                    <Image
                      src={card.smallimage}
                      alt={card.desc}
                      className="w-full h-full object-cover group-hover:scale-[1.15] transition-transform duration-500"
                      width={400}
                      height={280}
                      loading="lazy"
                      unoptimized
                    />
                    <div className="right-0 bottom-0 left-0 z-10 absolute bg-linear-to-t from-black/90 to-transparent h-1/2"></div>
                  </div>

                  <div className="z-20 relative flex flex-col flex-1 px-5 md:px-4 lg:px-5 py-5 md:py-5 lg:py-6">
                    <h2 className="flex items-center bg-clip-text bg-gradient-to-br from-[#f00c74] to-[#ff1152] mb-3 min-h-[2.6em] font-extrabold text-transparent 2xl:text-[1.3rem] md:text-lg lg:text-lg text-xl xl:text-xl uppercase leading-tight tracking-[0.5px]">
                      {card.desc}
                    </h2>

                    <div className="flex flex-col gap-3 mb-5 grow">
                      <div className="flex items-start gap-2">
                        <svg
                          className="mt-0.5 w-4 md:w-3.5 2xl:w-[18px] h-4 md:h-3.5 2xl:h-[18px] text-[#ff1152] shrink-0"
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
                        <span className="text-[#e0e0e0] md:text-[0.8rem] 2xl:text-[0.9rem] text-sm leading-relaxed">
                          {card.address}
                        </span>
                      </div>

                      {card.phone && (
                        <div className="flex items-start gap-2">
                          <svg
                            className="mt-0.5 w-4 md:w-3.5 2xl:w-[18px] h-4 md:h-3.5 2xl:h-[18px] text-[#ff1152] shrink-0"
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
                          <span className="text-[#e0e0e0] md:text-[0.8rem] 2xl:text-[0.9rem] text-sm leading-relaxed">
                            {card.phone}
                          </span>
                        </div>

                      )}
                      {card.email &&(<div className="flex items-start gap-2">
                          <span className="text-[#ff1152] md:text-[0.8rem] 2xl:text-[0.9rem] text-sm leading-relaxed">
                            @
                          </span>
                          <span className="text-[#e0e0e0] md:text-[0.8rem] 2xl:text-[0.9rem] text-sm leading-relaxed">
                            {card.email}
                          </span>
                        </div>)}
                    </div>

                    <Button
                      variant="primary"
                      size="md"
                      className="mt-auto w-full"
                    >
                      SELECT THIS PARK
                    </Button>
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
