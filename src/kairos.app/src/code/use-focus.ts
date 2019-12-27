import { useRef, useCallback, MutableRefObject } from 'react';

export const useFocus = (): [
  MutableRefObject<HTMLDivElement | null>,
  () => void,
] => {
  const htmlElRef = useRef<HTMLDivElement>(null);
  const setFocus = useCallback(() => {
    if (!!htmlElRef.current) {
      htmlElRef.current.focus();
    }
  }, [htmlElRef]);

  return [htmlElRef, setFocus];
};
