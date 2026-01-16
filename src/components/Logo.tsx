import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function Logo({ size = "md", animated = false }: LogoProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  if (animated) {
    return (
      <motion.div
        className="flex items-center gap-3"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" as const, stiffness: 200 }}
      >
        <img src="/aegis_logo.png" alt="ComplianceHub Logo" className={sizes[size]} />
        <span className={`font-display font-bold ${textSizes[size]} text-foreground`}>
          ComplianceHub
        </span>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <img src="/aegis_logo.png" alt="ComplianceHub Logo" className={sizes[size]} />
      <span className={`font-display font-bold ${textSizes[size]} text-foreground`}>
        ComplianceHub
      </span>
    </div>
  );
}
