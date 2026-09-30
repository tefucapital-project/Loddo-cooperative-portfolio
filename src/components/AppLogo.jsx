export const LOGO_SRC = '/AppLogo.png';

const SIZES = {
  sm: { img: 28, text: 'text-sm' },
  md: { img: 38, text: 'text-lg' },
  lg: { img: 56, text: 'text-2xl' },
  xl: { img: 88, text: 'text-3xl' },
};

export default function AppLogo({ size = 'md', withText = true, textClassName = '', className = '' }) {
  const dims = SIZES[size] || SIZES.md;
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="shrink-0 overflow-hidden rounded-full" style={{ width: dims.img, height: dims.img }}>
        <img src={LOGO_SRC} alt="Loddo Cooperative" className="h-full w-full scale-125 object-cover" />
      </div>
      {withText && (
        <span className={`font-bold tracking-tight text-brown-dark ${dims.text} ${textClassName}`}>
          Loddo Cooperative
        </span>
      )}
    </div>
  );
}
