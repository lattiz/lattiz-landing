import { useSyncExternalStore } from "react";

// El snapshot de servidor es `false`: el primer render coincide con el HTML y luego se corrige.
export const useMediaQuery = (query: string): boolean =>
    useSyncExternalStore(
        (onChange) => {
            const mql = window.matchMedia(query);
            mql.addEventListener("change", onChange);
            return () => mql.removeEventListener("change", onChange);
        },
        () => window.matchMedia(query).matches,
        () => false,
    );

export default useMediaQuery;
