import { useEffect, useState } from "react";

const ErrorToast = ({ error }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  if (!error || !visible) return null;

  return (
    <div className="toast toast-top toast-center z-50">
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    </div>
  );
};

export default ErrorToast;
