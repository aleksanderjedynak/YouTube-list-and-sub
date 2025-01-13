import { useState } from 'react';
import useChannelLists from '../hooks/useChannelLists.tsx';

const ListsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lists, deleteList } = useChannelLists();
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="open-lists-button">
        Show Lists
      </button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Added Lists</h2>
            {Object.keys(lists).length > 0 ? (
              <ul className="lists-display">
                {Object.entries(lists).map(([listName, channels]) => (
                  <li key={listName}>
                    <strong>{listName}</strong> ({channels.length} channels)
                    <button
                      className={'denger'}
                      onClick={() => deleteList(listName)}
                    >
                      usun
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No lists have been added yet.</p>
            )}
            <button onClick={handleClose} className="modal-close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ListsModal;
