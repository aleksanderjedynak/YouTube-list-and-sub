import React from 'react';
import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

interface UserInfo {
  [key: string]: string | number | boolean | null;
}

const UserInfoModal = (): React.ReactNode => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { userInfo } = useAuthContext() as { userInfo: UserInfo | null };

  if (!userInfo) return null;

  const handleClose = (): void => setIsOpen(false);

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
                  <strong>{key}:</strong>{' '}
                  {value !== null && value !== undefined
                    ? value.toString()
                    : 'N/A'}
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
