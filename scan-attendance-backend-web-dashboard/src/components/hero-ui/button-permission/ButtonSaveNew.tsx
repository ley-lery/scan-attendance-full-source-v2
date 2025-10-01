import { Button } from "@heroui/button";
import { layouts } from "../Index";
import { FormEvent } from "react";

interface Button {
  onClick?: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  text?: string;
}
const ButtonSaveNew: React.FC<Button> = ({
  onClick,
  text = "Button Save New",
}) => {
  return (
    <Button
      onClick={onClick}
      type="submit"
      radius={layouts.radius as "sm" | "md" | "lg"}
      size={layouts.size as "sm" | "md" | "lg"}
      color="secondary"
    >
      {text}
    </Button>
  );
};

export default ButtonSaveNew;
