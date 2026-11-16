import { LogoMark } from "@/components/ui/Logo";

export default function AuthCard({ title, children }) {
  return (
    <div className="page flex max-w-md flex-1 flex-col justify-center">
      <div className="card space-y-5 p-6 sm:p-8">
        <div className="flex flex-col items-center gap-2">
          <LogoMark className="h-12 w-12" />
          <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
