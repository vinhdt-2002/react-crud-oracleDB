import * as React from "react";

import { cn } from "lib/utils";

const Input = React.forwardRef(
  ({ className, label, icon, type, ...props }, ref) => {
    return (
      <div
        className={cn(
          "my-3 w-3/4 focus:outline-none bg-transparent text-sm font-semibold ",
          className
        )}
      >
        <div className="text-sm font-medium">{label}</div>
        <div className="flex justify-center items-center bg-transparent border rounded border-zinc-400 shadow-lg h-10 hover:ring-1">
          <span className="w-1/4 pl-3 text-base font-semibold">{icon}</span>
          <input
            type={type}
            className="w-3/4 focus:outline-none bg-transparent text-sm font-normal mr-2"
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
