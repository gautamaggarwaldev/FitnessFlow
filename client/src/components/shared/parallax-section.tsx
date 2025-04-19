import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  backgroundImage?: string;
  overlayColor?: string;
  height?: string;
  className?: string;
}

export default function ParallaxSection({
  children,
  backgroundImage,
  overlayColor = "bg-neutral-800/70",
  height = "min-h-screen",
  className = "",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${height} flex items-center justify-center ${className}`}
    >
      {backgroundImage && (
        <motion.div
          style={{
            y,
            opacity,
            backgroundImage: `url(${backgroundImage})`,
          }}
          className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        />
      )}
      <div className={`absolute inset-0 ${overlayColor}`} />
      <div className="container mx-auto px-4 relative z-10">
        {children}
      </div>
    </section>
  );
}
