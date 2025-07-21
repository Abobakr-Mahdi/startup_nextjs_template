type ButtonVariant = "primary" | "secondary" | "danger" | "success";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  variant: ButtonVariant;
  children: React.ReactNode;
  props?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}
