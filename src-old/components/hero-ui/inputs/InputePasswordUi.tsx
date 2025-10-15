import { cn, Input } from "@heroui/react";
import { type ComponentProps, useState } from "react";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";

type Props = ComponentProps<typeof Input>;

const InputPasswordUi = ({
  variant = "flat",
  labelPlacement = "outside",
  value,
  onChange,
  size = "md",
  ...props
}: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible((v) => !v);

  return (
    <Input
      variant={variant}
      labelPlacement={labelPlacement}
      value={value}
      classNames={{
        inputWrapper: cn(
          variant === "flat" ? "bg-zinc-200 dark:bg-zinc-800" : "",
          size === "sm" ? "input-small-ui" : "",
          size === "md" ? "input-medium-ui" : "",
          size === "lg" ? "input-large-ui" : "",
        ),
        ...(props.classNames || {}),
      }}
      onChange={onChange}
      endContent={
        <button
          aria-label="Toggle password visibility"
          aria-pressed={isVisible}
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <IoEyeSharp className="text-xl text-default-400 pointer-events-none" />
          ) : (
            <IoEyeOffSharp className="text-xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      {...props}
    />
  );
};

export default InputPasswordUi;