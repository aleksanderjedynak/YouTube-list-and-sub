import { Link } from 'react-router-dom';
import useChannelLists from '../hooks/useChannelLists.tsx';

const Navigation = () => {
  const { lists } = useChannelLists();

  return (
    <nav className="lists-navigation">
      {Object.keys(lists).length > 0 ? (
        <div className="center-container">
          {Object.entries(lists).map(([listName]) => (
            <Link
              className={'navigation-link'}
              key={listName}
              to={`/${listName}`}
            >
              <span>{listName}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p>No lists have been added yet.</p>
      )}
    </nav>
  );
};

export default Navigation;
