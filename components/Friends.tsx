import styles from './Friends.module.css';
import settings from '@/settings.json';

type FriendItem = {
  name: string;
  desc: string;
  image: string;
  url: string;
};

const REPO_URL = 'https://github.com/v0id-ink/site';
const APPLY_URL = `${REPO_URL}/issues/new?labels=friend-submission&template=friend-submission.yml`;

export default function Friends() {
  const friends = (settings.friends || []) as FriendItem[];
  const total = friends.length + 1; // 友链卡片 + Apply 卡片

  return (
    <div className={styles.friends}>
      <p className={styles.title}>Friends</p>
      <div className={styles.stackWrapper}>
        <div
          className={styles.stack}
          style={{ '--total': total } as React.CSSProperties}
        >
          {/* Apply 卡片：始终在最底层 */}
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.card} ${styles.applyCard}`}
            style={{ zIndex: 1, '--offset': friends.length } as React.CSSProperties}
          >
            <div className={styles.applyContent}>
              <span className={styles.plus}>+</span>
              <span className={styles.applyText}>Apply</span>
            </div>
          </a>

          {/* 友链卡片：按顺序堆叠，第一张在最上层 */}
          {friends.map((friend, index) => (
            <a
              key={index}
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
              style={{
                zIndex: 10 + friends.length - index,
                '--offset': index,
              } as React.CSSProperties}
            >
              <img
                src={friend.image}
                alt={friend.name}
                className={styles.cardImg}
                loading="lazy"
                decoding="async"
              />
              <div className={styles.cardOverlay} />
              <div className={styles.cardContent}>
                <p className={styles.cardName}>{friend.name}</p>
                {friend.desc && <p className={styles.cardDesc}>{friend.desc}</p>}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
