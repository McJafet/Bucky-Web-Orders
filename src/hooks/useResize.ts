import { useState, useEffect } from "react";

export function useResize ({ breakpoint }: { breakpoint: number }) {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    if(width <= breakpoint) {
        return true
    } else {
        return false
    }
}