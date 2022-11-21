import { useEffect, useState } from "react";

interface IScroll {
  winHeight: number;
  docHeight: number;
  scrollY: number;
}

const useScrollYPosition = () => {
  const [toCheckBottom, setToCheckBottom] = useState<IScroll>({
    winHeight: window.innerHeight,
    docHeight: document.body.clientHeight,
    scrollY: window.scrollY,
  });

  useEffect(() => {
    let winHeightTimeout: NodeJS.Timeout, docHeightTimeout: NodeJS.Timeout;

    const handleDOMHeight = () => {
      setToCheckBottom((prev) => ({
        ...prev,
        docHeight: document.body.clientHeight,
      }));
    };

    const docResizeObs = new ResizeObserver(handleDOMHeight);

    const trackScroll = () => {
      setToCheckBottom((prev) => ({
        ...prev,
        scrollY: Math.ceil(window.scrollY),
      }));
    };
    const handleWinHeight = () => {
      setToCheckBottom((prev) => ({
        ...prev,
        winHeight: window.innerHeight,
      }));
    };

    const winHeightHandler = () => {
      clearTimeout(winHeightTimeout);

      winHeightTimeout = setTimeout(handleWinHeight, 50);
    };

    const docHeightHandler = () => {
      clearTimeout(docHeightTimeout);
      docHeightTimeout = setTimeout(trackScroll, 50);
    };

    window.addEventListener("scroll", docHeightHandler);
    docResizeObs.observe(document.body);
    window.addEventListener("resize", winHeightHandler);

    return () => {
      window.removeEventListener("scroll", docHeightHandler);
      docResizeObs.unobserve(document.body);
      window.removeEventListener("resize", winHeightHandler);
    };
  }, []);

  return { toCheckBottom };
};

export default useScrollYPosition;
