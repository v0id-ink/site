import styles from './Gallery.module.css';
import settings from '@/settings.json';

type GalleryItem = {
  name?: string;
  file: string;
};

/**
 * Gallery - 基于 settings.json 动态渲染
 * - file: 必需，图片路径为 /images/<file>
 * - name: 可选，有则添加标题+遮罩层，无则只显示图片
 */
export default function Gallery() {
  const items = settings.gallery as GalleryItem[];

  return (
    <div className={styles.gallery2}>
      <p className={styles.gallery}>Gallery</p>
      <div className={styles.autoWrapper}>
        {items.map((item, index) => {
          const bgImage = item.name
            ? `linear-gradient(0deg, #000000cc 11.53%, #66666600 32.99%), url(/images/${item.file})`
            : `url(/images/${item.file})`;

          return (
            <div
              key={index}
              className={`${styles.galleryItem} ${item.name ? styles.withName : ''}`}
              style={{ backgroundImage: bgImage }}
            >
              {item.name && <p className={styles.itemTitle}>{item.name}</p>}
            </div>
          );
        })}
      </div>
      <div className={styles.autoWrapper2}>
        <p className={styles.scrollRight}>Scroll right</p>
        <img src="/icons/arrow-right.svg" className={styles.arrowRight} alt="Scroll right" />
      </div>
    </div>
  );
}
