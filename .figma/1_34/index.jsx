import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.footer}>
      <p className={styles.contact}>Contact</p>
      <div className={styles.autoWrapper}>
        <p className={styles.lonely}>Lonely</p>
        <div className={styles.frame1}>
          <div className={styles.frame2}>
            <img src="../image/mqjgd4px-len2pwl.svg" className={styles.mail} />
            <p className={styles.liuQinyuOutlookCom}>liu_qinyu@outlook.com</p>
          </div>
          <div className={styles.frame2}>
            <img src="../image/mqjgd4px-k519mxx.svg" className={styles.mail} />
            <p className={styles.liuQinyuOutlookCom}>t.me/lonely_14</p>
          </div>
          <div className={styles.frame2}>
            <img src="../image/mqjgd4px-gscbaiz.svg" className={styles.mail} />
            <p className={styles.liuQinyuOutlookCom}>1280993766</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
