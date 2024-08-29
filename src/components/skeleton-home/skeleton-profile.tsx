import { Shimmer } from "../shimmer";
import { Skeleton } from "../skeleton";
import { SkeletonWrapper } from "../skeleton-wrapper";


export const SkeletonSlider = () => {
  return (
    <SkeletonWrapper>
      <div>
        <Skeleton type="title" className="h-80 w-screen" />
        {/* <Skeleton type="text" /> */}
        {/* <Skeleton type="text" /> */}
      </div>
      {/* <Shimmer /> */}
    </SkeletonWrapper>
  );
};
