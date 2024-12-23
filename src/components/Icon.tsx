import React from "react";

interface IconProps {
  src: string; // The source URL for the icon (required)
  width?: number; // The width of the icon (optional, default: 24)
  height?: number; // The height of the icon (optional, default: 24)
  alt?: string; // Alternative text for the icon (optional, default: "icon")
  className?: string; // Additional CSS class names (optional)
  [key: string]: any; // Allows for additional props
}

const Icon: React.FC<IconProps> = ({
  src,
  width = 24,
  height = 24,
  alt = "icon",
  className = "",
  ...props
}) => {
  return (
    <img
      src={src}
      width={width}
      height={height}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

export default Icon;
