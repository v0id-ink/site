'use client';

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import gsap from 'gsap';
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

function getPeek(): number {
  if (typeof window === 'undefined') return 80;
  const w = window.innerWidth;
  if (w < 768) return 48;
  return Math.max(55, Math.min(120, w * 0.08));
}

function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

export default function Friends() {
  const friends = (settings.friends || []) as FriendItem[];
  const total = friends.length + 1;

  // order[0] = 最前层，order[last] = 最底层（友链之间）
  const [order, setOrder] = useState<number[]>(friends.map((_, i) => i));
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const stackRef = useRef<HTMLDivElement>(null);
  const hoverTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const initialized = useRef(false);

  // 初始定位（useLayoutEffect 防止闪烁）
  useLayoutEffect(() => {
    const peek = getPeek();
    const mobile = isMobile();

    order.forEach((friendIndex, position) => {
      const card = cardRefs.current[friendIndex];
      if (!card) return;
      gsap.set(card, {
        [mobile ? 'y' : 'x']: peek * position,
        [mobile ? 'x' : 'y']: 0,
        zIndex: 10 + friends.length - position,
      });
    });

    initialized.current = true;
  }, []);

  // order 变化时动画
  useEffect(() => {
    if (!initialized.current) return;

    const peek = getPeek();
    const mobile = isMobile();

    order.forEach((friendIndex, position) => {
      const card = cardRefs.current[friendIndex];
      if (!card) return;

      gsap.to(card, {
        [mobile ? 'y' : 'x']: peek * position,
        [mobile ? 'x' : 'y']: 0,
        zIndex: 10 + friends.length - position,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
  }, [order, friends.length]);

  // 窗口缩放时重新定位（peek 值和轴向可能变化）
  useEffect(() => {
    const handleResize = () => {
      const peek = getPeek();
      const mobile = isMobile();
      order.forEach((friendIndex, position) => {
        const card = cardRefs.current[friendIndex];
        if (!card) return;
        gsap.set(card, {
          [mobile ? 'y' : 'x']: peek * position,
          [mobile ? 'x' : 'y']: 0,
          zIndex: 10 + friends.length - position,
        });
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [order, friends.length]);

  const handleMouseEnter = useCallback((friendIndex: number) => {
    hoverTimers.current[friendIndex] = setTimeout(() => {
      setOrder(prev => {
        if (prev[0] === friendIndex) return prev;
        return [friendIndex, ...prev.filter(i => i !== friendIndex)];
      });
    }, 1000);
  }, []);

  const handleMouseLeave = useCallback((friendIndex: number) => {
    const timer = hoverTimers.current[friendIndex];
    if (timer) {
      clearTimeout(timer);
      delete hoverTimers.current[friendIndex];
    }
  }, []);

  // 清理计时器
  useEffect(() => {
    return () => {
      Object.values(hoverTimers.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <div className={styles.friends}>
      <p className={styles.title}>Friends</p>
      <div className={styles.stackWrapper}>
        <div
          ref={stackRef}
          className={styles.stack}
          style={{ '--total': total } as React.CSSProperties}
        >
          {/* Apply 卡片：始终在最底层，不参与翻牌 */}
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

          {/* 友链卡片：hover > 1s 置顶 */}
          {friends.map((friend, friendIndex) => (
            <a
              key={friendIndex}
              ref={(el) => { cardRefs.current[friendIndex] = el; }}
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
              onMouseEnter={() => handleMouseEnter(friendIndex)}
              onMouseLeave={() => handleMouseLeave(friendIndex)}
              style={{
                zIndex: 10 + friends.length - friendIndex,
                '--offset': friendIndex,
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
