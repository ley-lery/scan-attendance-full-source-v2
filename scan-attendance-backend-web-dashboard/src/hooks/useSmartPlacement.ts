import { useState, useLayoutEffect } from "react";

type Placement = "top" | "bottom" | "left" | "right";

export function useSmartPlacement(triggerRef: React.RefObject<HTMLElement>) {
  const [placement, setPlacement] = useState<Placement>("bottom");

  useLayoutEffect(() => {
    function updatePlacement() {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // calculate space
      const spaceTop = rect.top;
      const spaceBottom = vh - rect.bottom;
      const spaceLeft = rect.left;
      const spaceRight = vw - rect.right;

      let newPlacement: Placement = "bottom";

      // if bottom space is less than 300 and top space is greater than bottom space
      if (spaceBottom < 300 && spaceTop > spaceBottom) {
        newPlacement = "top";
      }
      // if right space is less than 300 and left space is greater than right space
      else if (spaceRight < 300 && spaceLeft > spaceRight) {
        newPlacement = "left";
      }
      // if left space is less than 300 and right space is greater than left space
      else if (spaceLeft < 300 && spaceRight > spaceLeft) {
        newPlacement = "right";
      }

      setPlacement(newPlacement);
    }

    updatePlacement();
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", updatePlacement, true);

    return () => {
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
    };
  }, [triggerRef]);

  return placement;
}
