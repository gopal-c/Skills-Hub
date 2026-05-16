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
      <section className="mx-auto max-w-5xl px-s-8 py-s-12">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-s-2 h-10 w-56" />
        <Skeleton className="mt-s-3 h-4 w-80" />

        <ul className="mt-s-8 grid gap-s-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i}>
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-s-2">
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex gap-s-1">
                    <Skeleton className="h-5 w-14" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
