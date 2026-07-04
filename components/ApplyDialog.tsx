'use client';

import { useEffect } from 'react';
import styles from './ApplyDialog.module.css';

const REPO_URL = 'https://github.com/v0id-ink/site';
const ISSUE_URL = `${REPO_URL}/issues/new?labels=friend-submission&template=friend-submission.yml`;
const MAIL_ADDRESS = 'hi-friends@v0id.ink';

type ApplyDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function ApplyDialog({ open, onClose }: ApplyDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      data-slot-lightbox
      onClick={onClose}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="apply-dialog-title"
    >
      <div className={styles.scaleWrapper}>
        <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="22.5" height="22.5" viewBox="0 0 25 25" fill="none">
              <path
                d="M1.06055 1.06067L12.3105 12.3107M23.5605 1.06067L12.3105 12.3107M12.3105 12.3107L1.06055 23.5607M12.3105 12.3107L23.5605 23.5607"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
          </button>

          <h2 id="apply-dialog-title" className={styles.title}>
            Welcome, Friends.
          </h2>
          <p className={styles.subtitle}>Choose your submission method.</p>

          <div className={styles.buttons}>
            <a
              href={ISSUE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btn} ${styles.btnGithub}`}
            >
              <span className={styles.btnMain}>Github</span>
              <span className={styles.btnSub}>(recommend)</span>
            </a>
            <a
              href={`mailto:${MAIL_ADDRESS}`}
              className={`${styles.btn} ${styles.btnMail}`}
            >
              <span className={styles.btnMain}>Mail</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
