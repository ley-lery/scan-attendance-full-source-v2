import { Button } from "@heroui/button";
import React, { memo } from "react";
import { PiBroomFill } from "react-icons/pi";
import { layouts } from "../Index";

interface Button {
  onPress?: () => void;
  text?: string;
}
const ButtonClear: React.FC<Button> = ({ onPress, text = "Button Clear" }) => {
  return (
    <Button
      type="button"
      color="danger"
      radius={layouts.radius as "sm" | "md" | "lg"}
      size={layouts.size as "sm" | "md" | "lg"}
      variant="solid"
      onPress={onPress}
    >
      <PiBroomFill />
      {text}
    </Button>
  );
};

export default memo(ButtonClear);
