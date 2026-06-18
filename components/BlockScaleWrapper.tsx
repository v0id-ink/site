'use client';

import { useEffect, useState } from 'react';

type Origin = 'center' | 'top';
type Mode = 'cover' | 'contain';

/**
 * 设计稿 Block 缩放包装器
 * - 桌面端（>=768px）：按 mode 等比缩放
 *   - cover: 填满屏幕，允许裁剪，无黑边
 *   - contain: 完整显示内容，以屏幕较短边为基准，可能露出同色系背景
 * - 移动端（<768px）：直接渲染子组件，由子组件自身的 @media 做流式适配
 */
export default function BlockScaleWrapper({
  children,
  designWidth = 1440,
  designHeight,
  origin = 'center',
  mode = 'cover',
  backgroundColor,
}: {
  children: React.ReactNode;
  designWidth?: number;
  designHeight: number;
  origin?: Origin;
  mode?: Mode;
  backgroundColor?: string;
}) {
  const [isNarrow, setIsNarrow] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const narrow = window.innerWidth < 768;
      setIsNarrow(narrow);
      if (!narrow) {
        const scaleX = window.innerWidth / designWidth;
        const scaleY = window.innerHeight / designHeight;
        setScale(mode === 'cover' ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [designWidth, designHeight, mode]);

  if (isNarrow) {
    return <>{children}</>;
  }

  const isTop = origin === 'top';

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: backgroundColor || 'transparent',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: isTop ? 0 : '50%',
          left: '50%',
          width: designWidth,
          height: designHeight,
          transformOrigin: isTop ? 'top center' : 'center center',
          transform: isTop
            ? `translateX(-50%) scale(${scale})`
            : `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
