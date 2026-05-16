import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-bg-page">
      <div className="border-b border-border-hairline bg-bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-s-8 py-s-4">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-7 w-20" />
        </div>
      </div>
      <section className="mx-auto max-w-4xl px-s-8 py-s-10">
        <Skeleton className="h-4 w-32" />
        <div className="mt-s-4 space-y-s-3 border-b border-border-hairline pb-s-6">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="mt-s-8 space-y-s-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-32" />
          <div className="mt-s-4 flex flex-wrap gap-s-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-7 w-24" />
          </div>
        </div>

        <div className="mt-s-12 space-y-s-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-32" />
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-s-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
