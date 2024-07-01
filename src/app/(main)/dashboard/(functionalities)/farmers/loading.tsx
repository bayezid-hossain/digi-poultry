import { Loader2 } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="flex h-full w-full items-start justify-center">
      <div className="absolute flex h-full  w-full max-w-xl flex-col items-center justify-center backdrop-blur-3xl sm:h-full md:max-w-2xl xl:max-w-3xl ">
        <div>
          <Loader2 className="flex animate-spin items-center justify-center" />
        </div>
      </div>
    </div>
  );
};

export default loading;
