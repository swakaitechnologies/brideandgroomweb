import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
  | "default"
  | "ghost"
  | "hero"
  | "heroOutline"
  | "gold"
  | "outline"
  | "secondary"
  | "destructive";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "default", size = "default", ...props },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 gap-2 active:scale-[0.98]";

    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg shadow-primary/10",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-lg shadow-secondary/20",
      ghost: "hover:bg-accent hover:text-accent-foreground shadow-none",
      hero: "bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:translate-y-[-2px] text-base font-medium tracking-widest ",
      heroOutline:
        "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground backdrop-blur-sm text-base font-medium tracking-widest ",
      gold: "bg-secondary text-secondary-foreground font-medium tracking-widest  shadow-xl shadow-secondary/20 hover:scale-105 transition-all",
      outline:
        "border-2 border-border bg-background hover:bg-muted text-foreground shadow-sm",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3 text-xs",
      lg: "h-12 rounded-lg px-8 text-base",
      xl: "h-14 rounded-xl px-10 text-lg",
      icon: "h-10 w-10",
    };

    const variantStyles =
      variants[variant as keyof typeof variants] || variants.default;
    const sizeStyles = sizes[size as keyof typeof sizes] || sizes.default;

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };





