import { useState, useEffect, useRef } from 'react';

export function useAlert() {
  const [alertMessage, setAlertMessage] = useState("");
  const alertTimeoutRef = useRef(null);

  const showAlert = (message) => {
    setAlertMessage(message);
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    alertTimeoutRef.current = setTimeout(() => {
      setAlertMessage("");
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  return { alertMessage, showAlert };
}