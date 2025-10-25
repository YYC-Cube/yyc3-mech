import { Loading } from "@/components/ui/loading";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#1A1C22] flex items-center justify-center">
      <Loading variant="gear" size="lg" text="系统启动中..." />
    </div>
  );
}
