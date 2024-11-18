import { useLayoutEffect, useState } from "react";

interface MaxTextLengthProps {
  texts: string[];
  fontSize: number;
  fontFamily?: string;
  rotation?: number;
  fontWeight?: string;
  textAnchor?: string;
  dominantBaseline?: string;
}

export const useMaxTextLength = ({
  texts,
  fontSize,
  fontFamily = "sans-serif",
  rotation = 0,
  fontWeight = "normal",
  dominantBaseline = "alphabetic",
  textAnchor = "start",
}: MaxTextLengthProps) => {
  const [maxTextLength, setMaxTextLength] = useState<number>(0);

  useLayoutEffect(() => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);

    const textLengths = texts.map((value) => {
      const textEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      textEl.setAttribute("visibility", "hidden");
      textEl.setAttribute("font-size", `${fontSize}`);
      textEl.setAttribute("font-family", fontFamily);
      textEl.setAttribute("font-weight", fontWeight);
      textEl.setAttribute("text-anchor", textAnchor);
      textEl.setAttribute("dominant-baseline", dominantBaseline);
      if (rotation !== 0) {
        textEl.setAttribute("transform", `rotate(${rotation})`);
      }
      textEl.textContent = value;
      svg.appendChild(textEl);
      const length = textEl.getComputedTextLength();
      svg.removeChild(textEl);
      return length;
    });

    setMaxTextLength(Math.max(...textLengths));
    document.body.removeChild(svg);
    console.log(`Max text lengths: ${Math.max(...textLengths)}`);
  }, [texts, fontSize, rotation]);

  return maxTextLength;
};
