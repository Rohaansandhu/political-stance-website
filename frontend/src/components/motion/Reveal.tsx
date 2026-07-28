import { useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import type { BoxProps } from "@chakra-ui/react";
import { MotionBox } from "./MotionBox";

type Direction = "up" | "left" | "right";

interface RevealProps extends Omit<BoxProps, keyof HTMLMotionProps<"div">> {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  distance?: number;
  duration?: number;
}

const offsetFor = (direction: Direction, distance: number) => {
  switch (direction) {
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
    default:
      return { x: 0, y: distance };
  }
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  distance = 24,
  duration = 0.6,
  ...boxProps
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const offset = prefersReducedMotion ? { x: 0, y: 0 } : offsetFor(direction, distance);

  return (
    <MotionBox
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -120px 0px" }}
      transition={{
        duration: prefersReducedMotion ? 0.15 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...boxProps}
    >
      {children}
    </MotionBox>
  );
}
