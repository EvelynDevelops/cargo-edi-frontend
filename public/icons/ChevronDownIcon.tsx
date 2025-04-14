import React from "react";
import { IconProps } from "./type";

const ChevronDownIcon: React.FC<IconProps> = ({
  width = 16,
  height = 16,
  viewBox = "0 0 20 20",
  color = "currentColor",
  ActiveColor = "#3B82F6", // 蓝色，与CargoTypeSelect中的blue-500对应
  isActive = false,
  className = "",
  ...rest
}) => {
  const fillColor = isActive ? ActiveColor : color;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        fill={fillColor}
      />
    </svg>
  );
};

export default ChevronDownIcon; 