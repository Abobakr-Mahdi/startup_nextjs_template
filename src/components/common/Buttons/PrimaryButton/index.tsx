import { motion } from "framer-motion";
import { ButtonProps } from "./types";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PrimaryButton({
  isLoading,
  variant,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      {...props}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "text-white px-4 py-2 rounded-md",
        variant === "primary" ? "bg-primary-500" : "bg-secondary-500",
        variant === "danger" ? "bg-red-500" : "bg-green-500",
        variant === "success" ? "bg-green-500" : "bg-red-500"
      )}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </motion.button>
  );
}
