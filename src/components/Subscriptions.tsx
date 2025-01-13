import React, { useState } from 'react';
import useSubscriptions from '../hooks/useSubscriptions';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

interface Thumbnail {
  high: {
    url: string;
  };
}

interface Snippet {
  title: string;
  description?: string;
  publishedAt: string;
  thumbnails: Thumbnail;
  resourceId: {
    channelId: string;
  };
}

interface Statistics {
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
}

interface BrandingSettings {
  image?: {
    bannerExternalUrl?: string;
  };
}

interface Subscription {
  id: string;
  snippet: Snippet;
  statistics?: Statistics;
  brandingSettings?: BrandingSettings;
}

interface ChannelDetails {
  brandingSettings: BrandingSettings;
  statistics: Required<Statistics>;
  snippet: Required<Snippet>;
}

interface TypeSubscription {
  id: string;
  name: string;
  details: ChannelDetails | null;
}

const Subscriptions: React.FC = () => {
  const { accessToken } = useAuth();
  const { subscriptions, fetchSubscriptions, getSubscriptionCount } =
    useSubscriptions(accessToken);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortCriteria, setSortCriteria] = useState<string>('default');
  const [selectedChannel, setSelectedChannel] =
    useState<TypeSubscription | null>(null);

  const handleRefresh = async (): Promise<void> => {
    await fetchSubscriptions();
    console.log('Lista subskrypcji została odświeżona.');
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setSortCriteria(event.target.value);
  };

  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    if (sortCriteria === 'name') {
      return a.snippet.title.localeCompare(b.snippet.title);
    } else if (sortCriteria === 'date') {
      return (
        new Date(a.snippet.publishedAt).getTime() -
        new Date(b.snippet.publishedAt).getTime()
      );
    } else if (sortCriteria === 'subscribers') {
      const aSubscribers = parseInt(a.statistics?.subscriberCount || '0', 10);
      const bSubscribers = parseInt(b.statistics?.subscriberCount || '0', 10);
      return bSubscribers - aSubscribers;
    } else if (sortCriteria === 'videos') {
      const aVideos = parseInt(a.statistics?.videoCount || '0', 10);
      const bVideos = parseInt(b.statistics?.videoCount || '0', 10);
      return bVideos - aVideos;
    }
    return 0;
  });

  const filteredSubscriptions = sortedSubscriptions.filter((sub) =>
    sub.snippet.title.toLowerCase().includes(searchQuery)
  );

  const handleUnsubscribe = async (subscriptionId: string): Promise<void> => {
    try {
      await fetch(
        `https://www.googleapis.com/youtube/v3/subscriptions?id=${subscriptionId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log('Odsubskrybowano kanał:', subscriptionId);
      await fetchSubscriptions();
    } catch (error) {
      console.error('Nie udało się odsubskrybować kanału:', error);
    }
  };

  const fetchChannelDetails = async (
    channelId: string
  ): Promise<ChannelDetails | null> => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        return data.items[0];
      }
    } catch (error) {
      console.error('Nie udało się pobrać szczegółów kanału:', error);
    }
    return null;
  };

  const handleShowModal = async (channel: Subscription): Promise<void> => {
    const channelDetails = await fetchChannelDetails(
      channel.snippet.resourceId.channelId
    );
    if (channelDetails) {
      setSelectedChannel({
        id: channel.id,
        name: channel.snippet.title,
        details: channelDetails,
      });
    } else {
      console.error('Channel details are null');
    }
  };

  const handleCloseModal = (): void => {
    setSelectedChannel(null);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Subskrypcje</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Liczba subskrypcji: {getSubscriptionCount()}
      </h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '0 20px',
        }}
      >
        <Link
          to={`/`}
          className={'subscriptions'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#005f99',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '20px',
          }}
        >
          {`<`} Home
        </Link>

        <button onClick={handleRefresh} className={'sub'}>
          Odśwież listę subskrypcji
        </button>

        <input
          type="text"
          placeholder="Wyszukaj subskrypcje..."
          value={searchQuery}
          onChange={handleSearch}
          style={{
            flex: '1',
            margin: '0 250px',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />

        <select
          onChange={handleSortChange}
          value={sortCriteria}
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          <option value="default">Domyślnie</option>
          <option value="name">Nazwa</option>
          <option value="date">Data utworzenia</option>
          <option value="subscribers">Liczba subskrybentów</option>
          <option value="videos">Liczba filmów</option>
        </select>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '20px',
        }}
      >
        {filteredSubscriptions.map((sub) => (
          <div
            key={sub.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <img
              src={sub.snippet.thumbnails.high.url}
              alt={sub.snippet.title}
              style={{ width: '100%', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => handleShowModal(sub)}
            />
            <h3>{sub.snippet.title}</h3>
            <button
              className={'click'}
              onClick={() =>
                window.open(
                  `https://www.youtube.com/channel/${sub.snippet.resourceId.channelId}`,
                  '_blank'
                )
              }
            >
              Otwórz kanał
            </button>
            <hr />
            <button
              className={'denger'}
              onClick={() => handleUnsubscribe(sub.id)}
            >
              Odsubskrybuj
            </button>
          </div>
        ))}
      </div>

      {selectedChannel && selectedChannel.details && (
        <div
          style={{
            position: 'fixed',
            top: '10%',
            left: '50%',
            transform: 'translate(-50%, 0)',
            backgroundColor: '#1e1e1e',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            width: '80%',
            height: '80%',
            overflowY: 'auto',
          }}
        >
          <button
            style={{ float: 'right' }}
            className={'denger'}
            onClick={handleCloseModal}
          >
            Zamknij
          </button>
          <h2>{selectedChannel.details.snippet.title}</h2>
          <img
            src={selectedChannel.details.snippet.thumbnails.high.url}
            alt={selectedChannel.details.snippet.title}
            style={{
              width: '250px',
              height: '250px',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
          <p>
            <strong>Opis:</strong> {selectedChannel.details.snippet.description}
          </p>
          <p>
            <strong>Liczba subskrybentów:</strong>{' '}
            {selectedChannel.details.statistics.subscriberCount}
          </p>
          <p>
            <strong>Liczba filmów:</strong>{' '}
            {selectedChannel.details.statistics.videoCount}
          </p>
          <p>
            <strong>Liczba wyświetleń:</strong>{' '}
            {selectedChannel.details.statistics.viewCount}
          </p>
          <p>
            <strong>Data utworzenia:</strong>{' '}
            {new Date(
              selectedChannel.details.snippet.publishedAt
            ).toLocaleDateString()}
          </p>
          {selectedChannel.details.brandingSettings.image
            ?.bannerExternalUrl && (
            <img
              src={
                selectedChannel.details.brandingSettings.image.bannerExternalUrl
              }
              alt="Baner kanału"
              style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }}
            />
          )}
        </div>
      )}

      {selectedChannel && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
          onClick={handleCloseModal}
        ></div>
      )}
    </div>
  );
};

export default Subscriptions;
