import React from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
}

export default function LoadingButton({
  loading,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button {...props} type="submit" disabled={loading || props.disabled}>
      <span className="flex items-center justify-center gap-1">
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </span>
    </Button>
  );
}
