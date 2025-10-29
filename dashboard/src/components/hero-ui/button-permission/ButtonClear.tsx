import { Button } from "@/components/hero-ui";
import React, { memo } from "react";
import { PiBroomFill } from "react-icons/pi";

interface Button {
  onPress?: () => void;
  text?: string;
}
const ButtonClear: React.FC<Button> = ({ onPress, text = "Button Clear" }) => {
  return (
    <Button
      type="button"
      color="danger"
      radius="md"
      size="sm"
      variant="solid"
      onPress={onPress}
    >
      <PiBroomFill />
      {text}
    </Button>
  );
};

export default memo(ButtonClear);
