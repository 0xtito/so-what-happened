import React from "react";

export function VerticalDivider() {
  return (
    <div className="relative px-2">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="h-screen border-t border-gray-300" />
      </div>
    </div>
  );
}
