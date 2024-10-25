import { ReactNode, useEffect, useRef } from "react";

import { useAppStore } from "../state/AppStore";

interface SvgCanvasProps {
  children?: ReactNode | ReactNode[];
}

const SvgCanvas = ({ children }: SvgCanvasProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const setSvgRef = useAppStore((state) => state.setSvgRef);
  const setDimensions = useAppStore((state) => state.setDimensions);
  const { svgWidth, svgHeight } = useAppStore((state) => ({
    svgWidth: state.width,
    svgHeight: state.height,
  }));

  useEffect(() => {
    setSvgRef(svgRef);

    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        if (svgWidth !== width || svgHeight !== height) {
          setDimensions(width, height);
          console.log(`width: ${width} height: ${height}`);
        }
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
  }, [svgWidth, svgHeight]);

  return (
    <svg ref={svgRef} style={{ height: "100%", width: "100%" }}>
      {children}
    </svg>
  );
};

export default SvgCanvas;
