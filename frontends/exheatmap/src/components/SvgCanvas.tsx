import { ReactNode, useEffect, useRef } from "react";

import { useAppStore } from "../state/AppStore";

interface SvgCanvasProps {
  children?: ReactNode | ReactNode[];
}

const SvgCanvas = ({ children }: SvgCanvasProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const setSvgRef = useAppStore((state) => state.setSvgRef);
  // const setDimensions = useAppStore((state) => state.setDimensions);
  const setSvgWidth = useAppStore((state) => state.setSvgWidth);

  useEffect(() => {
    setSvgRef(svgRef);

    const updateDimensions = () => {
      if (svgRef.current) {
        const { width } = svgRef.current.getBoundingClientRect();
        requestAnimationFrame(() => {
          // setDimensions(width, height);
          setSvgWidth(width);
        });
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (svgRef.current) {
      resizeObserver.observe(svgRef.current);
    }

    // Initial dimension update
    updateDimensions();

    return () => {
      if (svgRef.current) {
        resizeObserver.unobserve(svgRef.current);
      }
    };
  }, []);

  return (
    <svg ref={svgRef} style={{ height: "100%", width: "100%" }}>
      {children}
    </svg>
  );
};

export default SvgCanvas;
