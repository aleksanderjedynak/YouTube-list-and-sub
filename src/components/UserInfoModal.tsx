import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext.tsx';

const UserInfoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useAuthContext();

  if (!userInfo) return null;

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="user-info-button">
        Show User Info
      </button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>User Information</h2>
            <ul className="user-info-list">
              {Object.entries(userInfo).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
            <button onClick={handleClose} className="modal-close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfoModal;
