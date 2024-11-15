import Image from 'next/image';
import PropTypes from 'prop-types';
import styles from '../styles/ImageMarquee.module.css';

const ImageMarquee = ({ imagesString }) => {
  if (!imagesString) return null;
  if(imagesString.indexOf(';') < 1) return null;
  
  const images = imagesString
    ? imagesString.split(';').map((item) => {
        const [src, title] = item.split('|');
        return { src: src.trim(), title: title ? title.trim() : '' };
      })
    : [];

  return (
    <div className={styles.marquee}>
      <div className={styles.marqueeContent}>
        {images.map((image, index) => (
          <div key={index} className={styles.imageContainer}>
            <img 
              src={image.src} 
              alt={image.title} 
              title={image.title} 
              width={400} 
              height={267} 
              loading='lazy'
            />
            {image.title && <p className={styles.title}>{image.title}</p>}
          </div>
        ))}
      </div>
      {/* Duplicate the marquee content to create a continuous loop */}
      <div className={styles.marqueeContentDuplicated}>
        {images.map((image, index) => (
          <div key={`${index}-duplicate`} className={styles.imageContainer}>
            <img 
              src={image.src} 
              alt={image.title} 
              title={image.title} 
              width={400} 
              height={267} 
               loading='lazy'
            />
            {image.title && <p className={styles.title}>{image.title}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

ImageMarquee.propTypes = {
  imagesString: PropTypes.string,
};

export default ImageMarquee;
