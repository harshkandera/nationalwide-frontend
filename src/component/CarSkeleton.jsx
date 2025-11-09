import { Skeleton } from "./ui/skeleton";
import MaxWidthWrapper from "./MaxWidthWrapper";

// SkeletonCard component remains unchanged
export function SkeletonCard() {
    return (
        <div className="flex flex-col items-center space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[100px]" />
            </div>
        </div>
    );
}

// CarsSkeleton component takes a count prop to determine the number of skeleton cards
export function CarsSkeleton({ count }) {
    return (
        <MaxWidthWrapper>
            <div className="grid md:grid-cols-4 w-full h-full justify-center items-center sm:grid-cols-2 grid-cols-1 gap-4">
                {Array.from({ length: count }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        </MaxWidthWrapper>
    );
}
