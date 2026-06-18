import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.gallery2}>
      <p className={styles.gallery}>Gallery</p>
      <div className={styles.autoWrapper}>
        <div className={styles.dJi20260618054728008}>
          <p className={styles.morningInHaikou}>Morning in Haikou</p>
        </div>
        <div className={styles.dJi20260618053940007} />
      </div>
      <div className={styles.autoWrapper2}>
        <p className={styles.scrollRight}>Scroll right</p>
        <img src="../image/mqjgcs2f-de00p0a.svg" className={styles.arrowRight} />
      </div>
    </div>
  );
}

export default Component;
