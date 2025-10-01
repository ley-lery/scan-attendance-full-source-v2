import { Button } from "@heroui/button";
import React, { FormEvent } from "react";
import { layouts } from "../Index";
interface Button {
  onClick?: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onPress?: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  startContent?: React.ReactNode | React.ReactElement;
  text?: string;
}

const ButtonSaveClose: React.FC<Button> = ({
  onClick,
  onPress,
  startContent,
  text = "Button Save Close",
}) => {
  return (
    <Button
      onPress={onPress}
      onClick={onClick}
      type="submit"
      radius={layouts.radius as "sm" | "md" | "lg"}
      size={layouts.size as "sm" | "md" | "lg"}
      color="primary"
      startContent={startContent}
    >
      {text}
    </Button>
  );
};

export default ButtonSaveClose;
