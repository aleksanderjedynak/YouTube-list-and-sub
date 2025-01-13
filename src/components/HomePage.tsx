import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import UserInfoModal from './UserInfoModal.tsx';
import Navigation from './Navigation.tsx';
import ListsModal from './ListsModal.tsx';
import { globalSubscriptionCount } from '../hooks/useSubscriptions.ts';
import { useAuthContext } from '../contexts/AuthContext.tsx';
import useChannelLists from '../hooks/useChannelLists.tsx';
import Footer from '../Footer.tsx';

const HomePage = () => {
  const navigate = useNavigate();
  const [listName, setListName] = useState<string>('');
  const { userInfo, handleLogin, handleLogout } = useAuthContext();

  const { createList } = useChannelLists();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\s+/g, '-').slice(0, 64);
    setListName(value);
  };

  const handleCreateList = () => {
    if (listName.length >= 3) {
      createList(listName);
      setListName('');
      navigate(`/${listName}`);
    } else {
      alert('List name must be between 3 and 64 characters long.');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleCreateList();
    }
  };

  return (
    <div className="home-page">
      <header className="home-header">
        {userInfo && <Navigation />}
        <div className="login-section">
          {userInfo ? (
            <>
              <span className="user-info">User: {userInfo.name}</span>
              <div className="center-container">
                <Link to={`/subscriptions`} className={'subscriptions'}>
                  <span>Subskrypcje</span>
                </Link>
              </div>
              <button onClick={handleLogout} className="logout-button">
                Log out
              </button>
            </>
          ) : (
            <button onClick={handleLogin} className="login-button">
              Log in with Google
            </button>
          )}
        </div>
      </header>

      <main className="home-main">
        <div className="add-list-section">
          {userInfo ? (
            <>
              <input
                type="text"
                id="newList"
                placeholder="Enter List Name"
                className="list-input"
                value={listName}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <button onClick={handleCreateList} className="create-list-button">
                Create List
              </button>
            </>
          ) : (
            <div
              style={{
                fontSize: '3.5rem',
              }}
            >
              Log in to create lists ;)
            </div>
          )}
        </div>
      </main>

      <footer className="home-footer">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div>
            {userInfo ? (
              <>
                <div className={'buttons-footer'}>
                  <UserInfoModal />
                  <ListsModal />
                </div>
                <div className={'info'}>
                  <p style={{ paddingRight: '10px' }}>
                    Liczba subskrypcji:{' '}
                    <strong style={{ color: 'blueviolet' }}>
                      {globalSubscriptionCount}{' '}
                    </strong>
                  </p>
                  <p>
                    Aktualny host:{' '}
                    <strong style={{ color: 'darkgrey' }}>
                      {window.location.origin}
                    </strong>
                  </p>
                </div>
              </>
            ) : (
              <Footer />
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
