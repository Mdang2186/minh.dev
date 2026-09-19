"use client";

import dynamic from "next/dynamic";

const LanyardDynamic = dynamic(
  () => import("@/components/ui/lanyard").then((m) => m.Lanyard),
  {
    ssr: false,
    loading: () => <div className="w-full h-full" />,
  }
);

export function LanyardClient(props: {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  profile?: any;
}) {
  return <LanyardDynamic {...props} />;
}
