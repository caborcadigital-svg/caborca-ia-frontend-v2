'use client';

interface SkeletonProps { className?: string; }

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded-xl ${className}`} style={{ background:'var(--sand-dark)' }} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl p-4 border shadow-sm space-y-3" style={{ background:'var(--card)', borderColor:'var(--border)' }}>
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-3 w-1/4" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-2xl p-4 border shadow-sm flex gap-3" style={{ background:'var(--card)', borderColor:'var(--border)' }}>
          <Skeleton className="w-14 h-14 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return <Skeleton className="h-32 w-full rounded-2xl" />;
}
