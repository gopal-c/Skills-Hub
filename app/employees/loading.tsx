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
      <section className="mx-auto max-w-6xl px-s-8 py-s-12">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-s-2 h-10 w-48" />
        <Skeleton className="mt-s-3 h-4 w-80" />

        <ul className="mt-s-8 grid gap-s-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <Card className="h-full">
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="mt-s-2 h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-s-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-14" />
                    <Skeleton className="h-5 w-24" />
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
