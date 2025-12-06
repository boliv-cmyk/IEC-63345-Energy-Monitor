
import { useEffect, useRef } from 'react';

/**
 * Hook to automatically trigger an action (lock) after a period of inactivity.
 * Resets timer on mousemove or keydown events.
 * 
 * @param isLocked Current locked state
 * @param onLock Function to call when timeout triggers
 * @param timeoutMs Timeout in milliseconds (default 60000ms)
 * @param isActive Whether the hook should be active (e.g. only when modal is open)
 */
export const useAutoLock = (
    isLocked: boolean, 
    onLock: () => void, 
    isActive: boolean = true, 
    timeoutMs: number = 60000
) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!isLocked && isActive) {
            timerRef.current = setTimeout(() => {
                onLock();
            }, timeoutMs);
        }
    };

    useEffect(() => {
        if (isActive && !isLocked) {
            resetTimer();
            window.addEventListener('mousemove', resetTimer);
            window.addEventListener('keydown', resetTimer);
        } else {
            if (timerRef.current) clearTimeout(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
        };
    }, [isActive, isLocked, timeoutMs]); // Re-bind if lock state changes
};
