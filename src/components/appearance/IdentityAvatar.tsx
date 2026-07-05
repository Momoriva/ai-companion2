import { useAppearance } from "../../appearance";

type IdentityAvatarProps = {
  identity: "ai" | "user";
  className?: string;
  label?: string;
};

export function IdentityAvatar({ identity, className = "", label }: IdentityAvatarProps) {
  const { getImageUrlForRole } = useAppearance();
  const src = getImageUrlForRole(identity === "ai" ? "aiAvatar" : "userAvatar");
  const name = label ?? (identity === "ai" ? "AI 头像" : "用户头像");

  return (
    <span className={`identity-avatar ${identity} ${className}`} aria-label={name} role="img">
      {src && <img src={src} alt="" aria-hidden="true" />}
    </span>
  );
}
