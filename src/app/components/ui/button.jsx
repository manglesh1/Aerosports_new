// components/ui/button.jsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center font-bold uppercase cursor-pointer transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 hover:scale-105",
	{
		variants: {
			variant: {
				// Primary pink filled button
				primary:
					"bg-neon-pink text-white border-2 border-neon-pink shadow-neon-pink hover:shadow-neon-pink-lg",

				// Neon green outline button
				secondary:
					"bg-transparent text-neon-green border-2 border-neon-green shadow-neon-green hover:shadow-neon-green-lg hover:bg-neon-green hover:text-black",

				// Red/pink filled button (pricing/promos)
				accent:
					"bg-neon-pink-light text-white border-2 border-neon-pink-light shadow-accent-pink hover:shadow-accent-pink-lg ",

				// Red/pink outline button (tickets)
				accentOutline:
					"bg-transparent text-neon-pink-light border-2 border-neon-pink-light shadow-accent-pink hover:shadow-accent-pink-lg hover:bg-neon-pink-light hover:text-white",

				// Neon green filled button (all attractions)
				neonGreen:
					"bg-neon-green text-grey-900 border-none shadow-neon-green-solid hover:shadow-neon-green-solid-lg ",
				textAccent:
					"text-neon-pink-light font-bold uppercase  text-[0.85rem] relative inline-block py-2 hover:text-neon-pink-light/80 hover:translate-x-[2px]"
			},
			size: {
				default: "px-11 py-[1.1rem] text-base tracking-[1.2px]",
				sm: "px-2 py-1 text-base",
				md: "px-8 py-4 text-[0.95rem] tracking-[1px]",
				lg: "px-10 py-5 text-base tracking-[0.0625rem]",
				full: "w-full px-10 py-5 text-base tracking-[0.0625rem]",
			},
			rounded: {
				default: "rounded-lg",
				md: "rounded-xl",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
			rounded: "default",
		},
	}
);

const Button = React.forwardRef(
	({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, rounded, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };
