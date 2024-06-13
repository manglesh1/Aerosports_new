"use client";

import React, { useState, useEffect } from "react";
import "../../styles/home.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
// import birthday_img from "@public/assets/images/home/birthday_img_home_page.svg";
// import birthday_m_img from "@public/assets/images/home/birthday_img_home_mobile.svg";
import birthday_69 from "@public/assets/images/home/Group_69.svg";
import birthday_70 from "@public/assets/images/home/Group_70.svg";
import line_pattern from "@public/assets/images/home/line_pattern.svg";

const Home = ({ params }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const location_slug = params.slug;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/dataSheet/${location_slug}`
        );
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
    <main>
      <Header />
      <section className="aero_home-headerimg-wrapper">
        {/* {data &&
          data.map((item, i) => {
            return (
              <div key={i}> */}
        {/* {item.headerimage.startsWith("https") ? (
          <Image
            src={item.headerimage}
            alt="header - image"
            width={1200}
            height={600}
            title="header image for more info about the image"
          />
        ) : (
          <Image
            src={`/${item.headerimage}`}
            alt="header - image"
            width={1200}
            height={600}
            title="header image for more info about the image"
          />
        )} */}
        <article>
          <h1>ONTARIO'S # 1 TRAMPOLINE PARK</h1>
          <p>
            over 120 trampolines and many attractions to explore we have
            something for everyone.
          </p>
          <div className="aero-btn-booknow">
            <button>WAIVER</button>
          </div>
        </article>
        {/* </div>
            );
          })} */}
      </section>
      <section className="aero_home-actionbtn-bg">
        <section className="aero-max-container aero_home-actionbtn">
          <h2 className="d-flex-center">JUMP STRIGHT TO</h2>
          <section className="aero_home-actionbtn-wrap">
            <div className="aero-btn-booknow">
              <button>ATTRACTIONS</button>
            </div>
            <div className="aero-btn-booknow">
              <button>PROGRAMS</button>
            </div>
            <div className="aero-btn-booknow">
              <button>BIRTHDAY PARTIES</button>
            </div>
            <div className="aero-btn-booknow">
              <button>GROUPS & EVENTS</button>
            </div>
          </section>
        </section>
      </section>
      <section className="aero_home-playsection">
        <section className="aero_home-playsection-bg">
          <section className="aero-max-container aero_home-playsection-1 d-flex-dir-col">
            <h2>THERE IS SO MUCH TO DO AT AEROSPORTS!</h2>
            <p>
              Every park feature and all the fun includes in your Aerosports
              hourly or multi visit pass. Prepare yourself to fly over our huge
              trampoline areas. duck and dive through extreme dodgeball and dunk
              your heart out in the slam zone.
            </p>
            <h2>Explore attractions</h2>
          </section>
        </section>
        <section className="aero-max-container aero_home-playsection-2 ">
          <article className="d-flex-dir-col">
            <Image
              src="https://storage.googleapis.com/aerosports/windsor/Challenge-boys.jpg"
              width={120}
              height={120}
              alt="play"
            />
            <figure className="aero_home-play-small-img">
              <Image src={line_pattern} width={120} height={120} alt="play" />
              <span>ARCADE</span>
            </figure>
          </article>
          <article className="d-flex-dir-col">
            <Image
              src="https://storage.googleapis.com/aerosports/windsor/Challenge-boys.jpg"
              width={120}
              height={120}
              alt="play"
            />
            <figure className="aero_home-play-small-img">
              <Image src={line_pattern} width={120} height={120} alt="play" />
              <span>ARCADE</span>
            </figure>
          </article>
          <article className="d-flex-dir-col">
            <Image
              src="https://storage.googleapis.com/aerosports/windsor/Challenge-boys.jpg"
              width={120}
              height={120}
              alt="play"
            />
            <figure className="aero_home-play-small-img">
              <Image src={line_pattern} width={120} height={120} alt="play" />
              <span>ARCADE</span>
            </figure>
          </article>
          <article className="d-flex-dir-col">
            <Image
              src="https://storage.googleapis.com/aerosports/windsor/Challenge-boys.jpg"
              width={120}
              height={120}
              alt="play"
            />
            <figure className="aero_home-play-small-img">
              <Image src={line_pattern} width={120} height={120} alt="play" />
              <span>ARCADE</span>
            </figure>
          </article>
          <article className="d-flex-dir-col">
            <Image
              src="https://storage.googleapis.com/aerosports/windsor/Challenge-boys.jpg"
              width={120}
              height={120}
              alt="play"
            />
            <figure className="aero_home-play-small-img">
              <Image src={line_pattern} width={120} height={120} alt="play" />
              <span>ARCADE</span>
            </figure>
          </article>
          <article className="d-flex-dir-col">
            <Image
              src="https://storage.googleapis.com/aerosports/windsor/Challenge-boys.jpg"
              width={120}
              height={120}
              alt="play"
            />
            <figure className="aero_home-play-small-img">
              <Image src={line_pattern} width={120} height={120} alt="play" />
              <span>ARCADE</span>
            </figure>
          </article>
          <article className="d-flex-dir-col">
            <Image
              src="https://storage.googleapis.com/aerosports/windsor/Challenge-boys.jpg"
              width={120}
              height={120}
              alt="play"
            />
            <figure className="aero_home-play-small-img">
              <Image src={line_pattern} width={120} height={120} alt="play" />
              <span>ARCADE</span>
            </figure>
          </article>
          <article className="d-flex-dir-col">
            <Image
              src="https://storage.googleapis.com/aerosports/windsor/Challenge-boys.jpg"
              width={120}
              height={120}
              alt="play"
            />
            <figure className="aero_home-play-small-img">
              <Image src={line_pattern} width={120} height={120} alt="play" />
              <span>ARCADE</span>
            </figure>
          </article>
        </section>
      </section>
      <section className="aero_home_birthday_section">
        <Image
          className="desktop-container"
          src={birthday_70}
          width={220}
          height={120}
          alt="birthday img"
        />
        <Image
          className="app-container"
          src={birthday_69}
          width={220}
          height={120}
          alt="birthday img"
        />
        {/* <div>
          <h2>KIDS PARTY PACKAGE</h2>
          <p>
            We feature a full assortment of birthday party packages, options and
            add-ons that are sure to impress jumpers of all ages. Aerosports
            Oakville – Mississauga hosts 3 party rooms as well as 2 large
            corporate rooms that fits up to 150 guests.Our birthday party guests
            love Aerosports aerial experience and incredible park features!
            We’ve recently added Canada’s largest Ninja Warrior Course and a
            fantastic Climb + Slide Kid Zone. Check them out below!Best of all,
            our trained party staff make it a complete breeze for parents and
            ensure our guests are always following our safety rules. Parents and
            supervision can choose to jump or relax in our comfortable perimeter
            wifi lounges.With all this, there’s no wonder we are one of the best
            birthday party places in the ONTARIO! LEARN MORE
          </p>
        </div> */}
      </section>
      <section className="aero_home_article_section">
        <section className="aero-max-container">
          <p>POPULAR STORIES</p>
          <h2>Every Updated Article</h2>
          <section className="aero_home_article_card-wrapper">
            <article className="aero_home_article_card">
              <Image
                src="https://storage.googleapis.com/aerosports/windsor/Challenge-boys.jpg"
                width={120}
                height={120}
                alt="article image"
                title="article image"
              />
              <div className="aero_home_article_desc">
                <div>1</div>
                <h3>Reasons for taking your kids to Indoor Playground</h3>
                <p>Continue Reading...</p>
              </div>
            </article>
            <article className="aero_home_article_card">
              <Image
                src="https://storage.googleapis.com/aerosports/windsor/Challenge-boys.jpg"
                width={120}
                height={120}
                alt="article image"
                title="article image"
              />
              <div className="aero_home_article_desc">
                <div>2</div>
                <h3>Reasons for taking your kids to Indoor Playground</h3>
                <p>Continue Reading...</p>
              </div>
            </article>
            <article className="aero_home_article_card">
              <Image
                src="https://storage.googleapis.com/aerosports/windsor/Challenge-boys.jpg"
                width={120}
                height={120}
                alt="article image"
                title="article image"
              />
              <div className="aero_home_article_desc">
                <div>3</div>
                <h3>Reasons for taking your kids to Indoor Playground</h3>
                <p>Continue Reading...</p>
              </div>
            </article>
            <article className="aero_home_article_card">
              <Image
                src="https://storage.googleapis.com/aerosports/windsor/Challenge-boys.jpg"
                width={120}
                height={120}
                alt="article image"
                title="article image"
              />
              <div className="aero_home_article_desc">
                <div>4</div>
                <h3>Reasons for taking your kids to Indoor Playground</h3>
                <p>Continue Reading...</p>
              </div>
            </article>
          </section>
        </section>
      </section>
      <section className="aero_home_feature_section-bg">
        <section className="aero-max-container aero_home_feature_section">
          <article className="aero_home_feature_section-card">
            <div>130+</div>
            <div>Trampolines</div>
          </article>
          <article className="aero_home_feature_section-card">
            <div>27,000+</div>
            <div>Square Feet</div>
          </article>
          <article className="aero_home_feature_section-card">
            <div>4+</div>
            <div>Party Rooms</div>
          </article>
          <article className="aero_home_feature_section-card">
            <div>6+</div>
            <div>Fun Attractions</div>
          </article>
        </section>
      </section>
      <Footer />
    </main>
  );
};

export default Home;
