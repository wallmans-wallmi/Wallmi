import svgPaths from "../imports/svg-mosha0vin9";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'light';
}

export function Logo({ size = 'md', variant = 'default' }: LogoProps) {
  const sizes = {
    sm: { width: 73.5, height: 15.75 },  // 25% of original
    md: { width: 102.9, height: 22.05 }, // 35% of original
    lg: { width: 147, height: 31.5 },    // 50% of original
    xl: { width: 191.1, height: 40.95 }, // 65% of original
  };

  const currentSize = sizes[size];
  const fillColor = variant === 'light' ? '#FFFFFF' : '#000000';
  const strokeColor = variant === 'light' ? '#FFFFFF' : '#000000';

  return (
    <div 
      className="relative"
      style={{
        width: `${currentSize.width}px`,
        height: `${currentSize.height}px`,
      }}
    >
      <svg 
        className="block size-full" 
        fill="none" 
        preserveAspectRatio="xMidYMid meet" 
        viewBox="0 0 294 63"
      >
        <g clipPath="url(#clip0_17_1640)">
          <g id="allmans">
            <path d={svgPaths.p24a62900} fill={fillColor} />
            <path d={svgPaths.p193efe00} fill={fillColor} />
            <path d={svgPaths.p3378af40} fill={fillColor} />
            <path d={svgPaths.p314c180} fill={fillColor} />
            <path d={svgPaths.p3f755000} fill={fillColor} />
            <path d={svgPaths.p1fb3b800} fill={fillColor} />
            <path d={svgPaths.p3723e80} fill={fillColor} />
          </g>
          <path 
            d={svgPaths.p27dc2500} 
            fill={fillColor} 
            stroke={strokeColor} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </g>
        <defs>
          <clipPath id="clip0_17_1640">
            <rect fill="white" height="62.5" width="293.2" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}