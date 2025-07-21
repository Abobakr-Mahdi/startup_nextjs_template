import { HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "danger" | "success";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  isLoading: boolean;
  variant: ButtonVariant;
  children: React.ReactNode;
}
