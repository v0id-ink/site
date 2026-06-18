import styles from './Footer.module.css';

/**
 * Footer - 1:1 还原 .figma/1_34
 * 联系方式可点击，hover 时下划线从左到右动画
 */
export default function Footer() {
  return (
    <div className={styles.footer}>
      <p className={styles.contact}>Contact</p>
      <div className={styles.autoWrapper}>
        <div className={styles.frame1}>
          <a href="mailto:liu_qinyu@outlook.com" className={styles.frame2}>
            <img src="/icons/mail.svg" className={styles.mail} alt="email" />
            <span className={styles.contactText}>liu_qinyu@outlook.com</span>
          </a>
          <a href="https://t.me/lonely_14" target="_blank" rel="noopener noreferrer" className={styles.frame2}>
            <img src="/icons/telegram.svg" className={styles.mail} alt="telegram" />
            <span className={styles.contactText}>t.me/lonely_14</span>
          </a>
          <a href="https://qm.qq.com/q/13I2zpaWnE" target="_blank" rel="noopener noreferrer" className={styles.frame2}>
            <img src="/icons/qq.svg" className={styles.mail} alt="qq" />
            <span className={styles.contactText}>1280993766</span>
          </a>
        </div>
        <p className={styles.lonely}>Lonely</p>
      </div>
    </div>
  );
}
