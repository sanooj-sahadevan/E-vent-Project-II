import Image from "next/image";
import { cn } from "@/utils/index";
import { forwardRef, HTMLAttributes, memo, useMemo } from "react";

interface SpinnerProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  size?: "sm" | "md" | "lg" | "xl"; // Added "xl" for extra-large size
  color?: "primary" | "secondary" | "muted" | "pink" | "gray"; // Added "pink" and "gray" for the new colors
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", color = "primary", ...props }, ref) => {
    // Updated color map to include pink and gray
    const colorMap = useMemo(
      () => ({
        primary: "text-primary",
        secondary: "text-secondary",
        muted: "text-muted-foreground",
        pink: "text-pink-500",  // Using TailwindCSS pink color class
        gray: "text-gray-500",  // Using TailwindCSS gray color class
      }),
      []
    );

    // Updated size map with an "xl" option
    const sizeMap = useMemo(
      () => ({
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16", // Extra-large size
      }),
      []
    );

    // Dynamically calculate dimensions
    const dimensions = useMemo(() => {
      const sizeClass = sizeMap[size];
      if (!sizeClass) return 32; // Fallback to a default dimension if size is invalid
      const heightClass = sizeClass.split(" ")[0]; // e.g., "h-4"
      const parsedSize = parseInt(heightClass.replace("h-", ""), 10);
      return isNaN(parsedSize) ? 32 : parsedSize * 4; // Default to 32 if parsedSize is NaN
    }, [size, sizeMap]);

    return (
      <div
        ref={ref}
        className={cn("relative inline-block animate-spin", sizeMap[size], colorMap[color], className)}
        {...props}
      >
        <Image
          src="/assests/icons/loader.svg"
          alt="Loading..."
          width={dimensions}
          height={dimensions}
          className="w-full h-full"
        />
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export default memo(Spinner);
