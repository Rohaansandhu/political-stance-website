import { chakra } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import { isValidMotionProp, motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ComponentType } from "react";

const ChakraMotionDiv = chakra(motion.div, {}, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

// Chakra's style props and Framer Motion's HTMLMotionProps share several
// names with incompatible types (`transition`, `color`, `translate`, ...).
// `Omit<BoxProps, keyof HTMLMotionProps<"div">>` drops every Chakra prop
// that collides with a Framer Motion/DOM prop of the same name, so Framer
// Motion's version always wins, while every non-colliding Chakra style prop
// (px, bg, _dark, responsive objects, etc.) still comes through untouched.
export type MotionBoxProps = HTMLMotionProps<"div"> & Omit<BoxProps, keyof HTMLMotionProps<"div">>;

export const MotionBox = ChakraMotionDiv as unknown as ComponentType<MotionBoxProps>;
