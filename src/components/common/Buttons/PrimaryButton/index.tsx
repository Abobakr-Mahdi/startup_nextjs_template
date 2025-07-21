import { motion } from "framer-motion";
import { ButtonProps } from "./types";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PrimaryButton({
  isLoading,
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-primary-500";
      case "secondary":
        return "bg-secondary-500";
      case "danger":
        return "bg-red-500";
      case "success":
        return "bg-green-500";
      default:
        return "bg-primary-500";
    }
  };

  return (
    <motion.button
      {...props}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "text-white px-4 py-2 rounded-md",
        getVariantStyles(),
        className
      )}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </motion.button>
  );
}
