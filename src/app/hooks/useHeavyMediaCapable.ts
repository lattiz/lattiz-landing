import { useSyncExternalStore } from "react";

// Mouse/trackpad + hover => a computer. Phones and tablets report
// `pointer: coarse` / `hover: none`, regardless of their screen size.
const DESKTOP_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

// Network Information API: only Chromium ships it (not in lib.dom).
interface NetworkInformation extends EventTarget {
    type?: string;
    effectiveType?: string;
    saveData?: boolean;
}

const getConnection = (): NetworkInformation | undefined =>
    (navigator as Navigator & { connection?: NetworkInformation }).connection;

function subscribe(onChange: () => void) {
    const mql = window.matchMedia(DESKTOP_POINTER_QUERY);
    const connection = getConnection();
    mql.addEventListener("change", onChange);
    connection?.addEventListener("change", onChange);
    return () => {
        mql.removeEventListener("change", onChange);
        connection?.removeEventListener("change", onChange);
    };
}

function getSnapshot(): boolean {
    if (!window.matchMedia(DESKTOP_POINTER_QUERY).matches) return false;

    // Missing API (Safari/Firefox) => we can't tell, so we don't penalize.
    const connection = getConnection();
    if (!connection) return true;

    if (connection.saveData) return false;
    if (connection.type === "cellular") return false;
    if (connection.effectiveType && connection.effectiveType !== "4g") return false;
    return true;
}

/**
 * `true` only on a computer-class device (fine pointer + hover) whose
 * connection is not cellular, not in data-saver mode and not slow.
 * The server snapshot is `false`, so heavy assets are never requested before
 * the client has decided.
 */
export const useHeavyMediaCapable = (): boolean =>
    useSyncExternalStore(subscribe, getSnapshot, () => false);

export default useHeavyMediaCapable;
