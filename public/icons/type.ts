export interface IconProps extends React.SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
    viewBox?: string;
    color?: string;
    ActiveColor?: string;
    isActive?: boolean;
    className?: string;
  }