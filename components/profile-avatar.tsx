import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, var(--brand-coral),  var(--brand-amber))",
  "linear-gradient(135deg, var(--brand-indigo), var(--brand-teal))",
  "linear-gradient(135deg, var(--brand-teal),   var(--brand-amber))",
  "linear-gradient(135deg, var(--brand-indigo), var(--brand-coral))",
];

function gradientFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

type Props = {
  name: string;
  email: string;
  /** Tailwind size class, e.g. "size-10", "size-14". Default size-10 (40px). */
  className?: string;
};

/**
 * Profile avatar — pravatar image keyed by email (deterministic),
 * with the gradient-initials treatment as fallback when the image
 * fails or hasn't loaded yet.
 */
export function ProfileAvatar({ name, email, className }: Props) {
  const src = `https://i.pravatar.cc/150?u=${encodeURIComponent(email || name)}`;

  return (
    <Avatar className={cn("size-10 after:hidden", className)}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback
        className="font-medium text-white"
        style={{ background: gradientFor(name) }}
      >
        {initial(name)}
      </AvatarFallback>
    </Avatar>
  );
}
