
import { createContext, useContext, useState, useCallback } from 'react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null); // { title, message, confirmText, cancelText, resolve }

  const confirm = useCallback(({ title = '¿Estás seguro?', message = '', confirmText = 'Confirmar', cancelText = 'Cancelar' } = {}) => {
    return new Promise((resolve) => {
      setDialog({ title, message, confirmText, cancelText, resolve });
    });
  }, []);

  const handleClose = (result) => {
    dialog?.resolve(result);
    setDialog(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialog && (
        <div className="confirm-overlay" onClick={() => handleClose(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{dialog.title}</h3>
            {dialog.message && <p>{dialog.message}</p>}
            <div className="confirm-actions">
              <button onClick={() => handleClose(false)}>{dialog.cancelText}</button>
              <button className="confirm-danger" onClick={() => handleClose(true)}>
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}