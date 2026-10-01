import Image from "next/image";
import styles from "./Lifestyle.module.css";

const MOMENTS = [
  {
    time: "Morning",
    text: "Coffee at a long stone bench, with light down the whole kitchen before anyone else is up.",
    image: "/images/home/kitchen-placeholder.jpg",
    alt: "Kitchen with long stone bench and timber floors",
  },
  {
    time: "Afternoon",
    text: "Kids home from school, doors open, and a verandah deep enough for a Brisbane storm.",
    image: "/images/home/springdale-verandah.jpg",
    alt: "Deep front verandah on the Springdale design",
  },
  {
    time: "Evening",
    text: "Lights on, balcony doors open, and the whole house glowing as the street goes quiet.",
    image: "/images/home/gardenwood-balcony-dusk.jpg",
    alt: "Upper balcony of the Gardenwood design lit at dusk",
  },
];

/** Local identity: homes designed around the Queensland climate and the Brisbane day. */
export default function Lifestyle() {
  return (
    <section className={`section ${styles.life}`} aria-labelledby="life-title">
      <div className="section-head">
        <span className="eyebrow">Designed for Queensland living</span>
        <h2 id="life-title" className="display">Homes that suit <span className="serif">the way you live.</span></h2>
        <p>Grounded, practical and connected to the outdoors: floor plans that make the most of the Brisbane climate and the way your day actually goes.</p>
      </div>
      <div className={styles.grid}>
        {MOMENTS.map((m) => (
          <figure key={m.time} className={styles.card}>
            <div className={styles.ph}>
              <Image src={m.image} alt={m.alt} fill quality={90} sizes="(max-width: 900px) 100vw, 33vw" />
            </div>
            <figcaption>
              <b className="display">{m.time}</b>
              <span>{m.text}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
