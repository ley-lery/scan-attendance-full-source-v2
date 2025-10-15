import { createContext, useContext } from "react";
import { DragControls } from "framer-motion";

interface DragContextProps {
  dragControls?: DragControls;
  isDraggable?: boolean;
}

export const DragContext = createContext<DragContextProps>({
  dragControls: undefined,
  isDraggable: false,
});

export const useDrag = () => useContext(DragContext);
