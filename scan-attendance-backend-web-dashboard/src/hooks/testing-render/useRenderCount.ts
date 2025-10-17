import { useEffect, useRef } from "react";

export function useRenderCount(name?: string, skip?: boolean) {
  const renderCount = useRef(0);

  useEffect(() => {
    if (skip) return; //  បើ skip=true នោះមិនរាប់ render
    renderCount.current += 1;
    console.log(
      `%c[RenderCount] ${name || "Component"} rendered ${renderCount.current} times`,
      "color: #4ade80; font-weight: bold;"
    );
  });
}
