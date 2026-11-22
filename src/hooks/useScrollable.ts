'use client';

import { useCallback, useState } from 'react';

export const useScrollable = <T extends HTMLElement>() => {
  const [scrollable, setScrollable] = useState(false);

  // callback ref с cleanup: списки рендерятся условно (isOpen),
  // наблюдатели должны подключаться при реальном появлении узла в DOM
  const ref = useCallback((node: T | null) => {
    if (!node) return;

    const check = () => setScrollable(node.scrollHeight > node.clientHeight);

    // ResizeObserver — ресайз контейнера, MutationObserver — догрузка контента
    const resizeObserver = new ResizeObserver(check);
    resizeObserver.observe(node);

    const mutationObserver = new MutationObserver(check);
    mutationObserver.observe(node, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    check();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return { ref, scrollable };
};
