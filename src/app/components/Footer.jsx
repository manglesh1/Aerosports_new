import Image from "next/image";
import "../styles/footer.css";
import event_icon from "@public/assets/images/home/event_icon.svg";
import park_feature_icon from "@public/assets/images/home/park_feature_icon.svg";
import jump_icon from "@public/assets/images/home/jump_icon.svg";

const Footer = () => {
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
        <div className="d-flex-center">
          <Image
            src="https://www.aerosportsparks.ca/assets/image/logo/logo.png"
            alt="footer logo"
            width={200}
            height={100}
          />
        </div>
        <section className="aero_footer_col-4-wrapper">
          <ul>
            <li>Services</li>
            <li>
              <a href="#">Open Jump</a>
            </li>
            <li>
              <a href="#">Aero Slam</a>
            </li>
            <li>
              <a href="#">Dodge ball</a>
            </li>
            <li>
              <a href="#">Ninja Warrior</a>
            </li>
            <li>
              <a href="#">Aero Drop</a>
            </li>
            <li>
              <a href="#">Climb&Slide</a>
            </li>
            <li>
              <a href="#">Climbing Walls</a>
            </li>
            <li>
              <a href="#">Arcade</a>
            </li>
          </ul>
          <ul>
            <li>Services</li>
            <li>
              <a href="#">Open Jump</a>
            </li>
            <li>
              <a href="#">Aero Slam</a>
            </li>
            <li>
              <a href="#">Dodge ball</a>
            </li>
            <li>
              <a href="#">Ninja Warrior</a>
            </li>
            <li>
              <a href="#">Aero Drop</a>
            </li>
            <li>
              <a href="#">Climb&Slide</a>
            </li>
            <li>
              <a href="#">Climbing Walls</a>
            </li>
            <li>
              <a href="#">Arcade</a>
            </li>
          </ul>
          <ul>
            <li>Services</li>
            <li>
              <a href="#">Open Jump</a>
            </li>
            <li>
              <a href="#">Aero Slam</a>
            </li>
            <li>
              <a href="#">Dodge ball</a>
            </li>
            <li>
              <a href="#">Ninja Warrior</a>
            </li>
            <li>
              <a href="#">Aero Drop</a>
            </li>
            <li>
              <a href="#">Climb&Slide</a>
            </li>
            <li>
              <a href="#">Climbing Walls</a>
            </li>
            <li>
              <a href="#">Arcade</a>
            </li>
          </ul>
          <ul>
            <li>Services</li>
            <li>
              <a href="#">
                <article className="d-flex-center aero_footer_article-card">
                  <Image
                    src="https://www.aerosportsparks.ca/assets/image/logo/logo.png"
                    alt="footer logo"
                    width={50}
                    height={50}
                  />
                  <div>
                    <h6>20-May-21</h6>
                    <p>Reasons fof taking kids to indoor Playground windsor</p>
                  </div>
                </article>
              </a>
            </li>
            <li>
              <a href="#">
                <article className="d-flex-center aero_footer_article-card">
                  <Image
                    src="https://www.aerosportsparks.ca/assets/image/logo/logo.png"
                    alt="footer logo"
                    width={50}
                    height={50}
                  />
                  <div>
                    <h6>20-May-21</h6>
                    <p>Reasons fof taking kids to indoor Playground windsor</p>
                  </div>
                </article>
              </a>
            </li>
            <li>
              <a href="#">
                <article className="d-flex-center aero_footer_article-card">
                  <Image
                    src="https://www.aerosportsparks.ca/assets/image/logo/logo.png"
                    alt="footer logo"
                    width={50}
                    height={50}
                  />
                  <div>
                    <h6>20-May-21</h6>
                    <p>Reasons fof taking kids to indoor Playground windsor</p>
                  </div>
                </article>
              </a>
            </li>
          </ul>
        </section>
      </section>
    </footer>
  );
};

export default Footer;
