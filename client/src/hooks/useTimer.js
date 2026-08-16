import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Timer de cuenta regresiva basado en timestamps (no en contar ticks),
 * para que no se desincronice si el navegador atrasa el setInterval
 * (ej: cuando la pestaña pierde el foco).
 */
function useTimer(initialSeconds, onComplete) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const endTimeRef = useRef(null); // timestamp en el que el timer debería terminar
  const onCompleteRef = useRef(onComplete);

  // Mantenemos la referencia actualizada sin tener que reiniciar el efecto
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const start = useCallback((seconds) => {
    const duration = seconds ?? initialSeconds;
    endTimeRef.current = Date.now() + duration * 1000;
    setSecondsLeft(duration);
    setIsRunning(true);
  }, [initialSeconds]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((seconds) => {
    setIsRunning(false);
    setSecondsLeft(seconds ?? initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        setIsRunning(false);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    };

    tick(); // corre una vez de inmediato para no esperar 1 seg antes del primer render
    const intervalId = setInterval(tick, 250); // cada 250ms para que se sienta fluido, no cada 1000ms

    return () => clearInterval(intervalId);
  }, [isRunning]);

  return { secondsLeft, isRunning, start, pause, reset };
}

export default useTimer;