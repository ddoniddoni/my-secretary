type PixelAvatarProps = {
  variant: "news" | "stock" | "baseball" | "real_estate" | "helper";
  size?: "sm" | "md" | "lg";
};

const avatarStyles = {
  news: {
    background: "linear-gradient(135deg, #dff7fb 0%, #9edce8 100%)",
    accent: "#0b7285",
    detail: "#085766",
  },
  stock: {
    background: "linear-gradient(135deg, #e2f9df 0%, #a9e6b0 100%)",
    accent: "#2b8a3e",
    detail: "#226b31",
  },
  baseball: {
    background: "linear-gradient(135deg, #fff4d6 0%, #f3c259 100%)",
    accent: "#c96900",
    detail: "#8a4500",
  },
  real_estate: {
    background: "linear-gradient(135deg, #e5f0ff 0%, #9ec2ff 100%)",
    accent: "#3358c8",
    detail: "#213a87",
  },
  helper: {
    background: "linear-gradient(135deg, #fff0dc 0%, #ffc98e 100%)",
    accent: "#e87432",
    detail: "#a64f1e",
  },
} satisfies Record<PixelAvatarProps["variant"], {
  background: string;
  accent: string;
  detail: string;
}>;

const sizeStyles = {
  sm: "h-14 w-14",
  md: "h-20 w-20",
  lg: "h-24 w-24",
} satisfies Record<NonNullable<PixelAvatarProps["size"]>, string>;

export function PixelAvatar({
  variant,
  size = "md",
}: PixelAvatarProps) {
  const palette = avatarStyles[variant];

  return (
    <div
      className={`relative shrink-0 rounded-[1.5rem] border border-black/5 ${sizeStyles[size]}`}
      style={{ background: palette.background }}
      aria-hidden="true"
    >
      <div
        className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[1rem]"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.32)" }}
      />
      <div className="absolute left-[24%] top-[26%] grid gap-[3px]">
        {Array.from({ length: 3 }).map((_, rowIndex) => (
          <div key={`left-eye-row-${rowIndex}`} className="flex gap-[3px]">
            {Array.from({ length: 3 }).map((_, colIndex) => (
              <span
                key={`left-eye-${rowIndex}-${colIndex}`}
                className="block h-[4px] w-[4px] rounded-[1px]"
                style={{ backgroundColor: palette.detail }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="absolute right-[24%] top-[26%] grid gap-[3px]">
        {Array.from({ length: 3 }).map((_, rowIndex) => (
          <div key={`right-eye-row-${rowIndex}`} className="flex gap-[3px]">
            {Array.from({ length: 3 }).map((_, colIndex) => (
              <span
                key={`right-eye-${rowIndex}-${colIndex}`}
                className="block h-[4px] w-[4px] rounded-[1px]"
                style={{ backgroundColor: palette.detail }}
              />
            ))}
          </div>
        ))}
      </div>
      <div
        className="absolute bottom-[26%] left-1/2 h-[10px] w-[36px] -translate-x-1/2 rounded-full"
        style={{ backgroundColor: palette.accent }}
      />
      <div
        className="absolute right-[14%] top-[16%] h-[10px] w-[10px] rounded-[3px]"
        style={{ backgroundColor: palette.accent }}
      />
    </div>
  );
}
