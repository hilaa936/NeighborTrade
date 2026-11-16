import Image from "next/image";

const SIZES = { sm: "h-8 w-8 text-sm", md: "h-11 w-11 text-base", lg: "h-20 w-20 text-2xl" };
const PIXELS = { sm: 32, md: 44, lg: 80 };
const COLORS = ["bg-leaf-200 text-leaf-800", "bg-earth-200 text-earth-800", "bg-amber-200 text-amber-800", "bg-sky-200 text-sky-800", "bg-rose-200 text-rose-800"];

// Profile picture, or the first letter of the name on a color picked from the id
export default function Avatar({ user, size = "md" }) {
  const classes = `${SIZES[size]} shrink-0 rounded-full`;
  if (user?.image) {
    return (
      <Image src={user.image} alt="" width={PIXELS[size]} height={PIXELS[size]} className={`${classes} object-cover`} />
    );
  }
  const seed = [...(user?.id ?? "")].reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return (
    <span aria-hidden className={`${classes} ${COLORS[seed % COLORS.length]} flex items-center justify-center font-bold`}>
      {user?.name?.trim()?.[0] ?? "?"}
    </span>
  );
}
