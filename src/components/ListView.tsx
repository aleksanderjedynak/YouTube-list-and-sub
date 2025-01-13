import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useChannelLists from '../hooks/useChannelLists.tsx';
import { globalSubscriptions } from '../hooks/useSubscriptions.ts';

const ListView = () => {
  const { listName } = useParams();
  const navigate = useNavigate();

  const { lists, toggleChannelInList } = useChannelLists();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = () => {
    setIsModalOpen(false);
  };

  const selectedChannels = lists[listName] || [];

  return (
    <div>
      <h1>List: {listName}</h1>
      <button className={'click'} onClick={() => navigate('/')}>
        {'< '} Home
      </button>

      <button
        className={'click'}
        onClick={() => setIsModalOpen(true)}
        style={{ marginTop: '20px' }}
      >
        Manage Channels
      </button>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#6c6477',
              padding: '20px',
              borderRadius: '8px',
              width: '80%',
              maxHeight: '80%',
              overflowY: 'auto',
            }}
          >
            <button className={'click'} onClick={handleSave}>
              Close
            </button>
            <button className={'sub'} onClick={handleSave}>
              Save
            </button>
            <h2>Manage Channels</h2>
            {globalSubscriptions?.map((sub) => (
              <div
                key={sub.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <input
                  type="checkbox"
                  onChange={() => toggleChannelInList(listName, sub)}
                  checked={selectedChannels.some((c) => c.id === sub.id)}
                  style={{ marginRight: '10px' }}
                />
                <img
                  src={sub.snippet.thumbnails.default.url}
                  alt={sub.snippet.title}
                  style={{
                    width: '50px',
                    height: '50px',
                    marginRight: '10px',
                    borderRadius: '8px',
                  }}
                />
                <span>{sub.snippet.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="selected-channels">
        <h2>Selected Channels</h2>
        {selectedChannels.map((channel) => (
          <div
            key={channel.id}
            className="subscription"
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <img
              src={channel.snippet.thumbnails.default.url}
              alt={channel.snippet.title}
              style={{
                width: '50px',
                height: '50px',
                marginRight: '10px',
                borderRadius: '8px',
              }}
            />
            <h2>{channel.snippet.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListView;
