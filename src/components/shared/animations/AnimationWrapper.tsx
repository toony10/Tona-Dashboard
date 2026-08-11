"use client";
import { motion, Variants, Transition, TargetAndTransition } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimationWrapperProps {
    children: React.ReactNode;
    initial?: unknown;
    whileInView?: unknown;
    transition?: Transition;
    variants?: Variants;
    viewport?: { once?: boolean; amount?: number };
    className?: string;
    style?: React.CSSProperties;
}

export default function AnimationWrapper({
    children,
    initial = { opacity: 0, y: 20 },
    whileInView = { opacity: 1, y: 0 },
    transition = { duration: 0.5 },
    variants,
    viewport = { once: true, amount: 0.3 },
    className,
    style
}: AnimationWrapperProps) {
    return (
        <motion.div
            initial={ initial as TargetAndTransition }
            whileInView={ whileInView as TargetAndTransition }
            transition={ transition }
            variants={ variants }
            viewport={ viewport }
            className={ cn(className) }
            style={ style }
        >
            { children }
        </motion.div>
    );
}