import { useState, useEffect, useCallback } from 'react';

const SUBSCRIPTIONS_API = `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50`;
const CHANNEL_DETAILS_API = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=`;

interface Subscription {
  id: string;
  snippet: {
    title: string;
    thumbnails: {
      default: {
        url: string;
      };
      high: {
        url: string;
      };
    };
    resourceId: {
      channelId: string;
    };
    publishedAt: string;
  };
  statistics?: {
    subscriberCount: string;
    videoCount: string;
  };
}

interface UseSubscriptionsResult {
  subscriptions: Subscription[];
  fetchSubscriptions: () => Promise<void>;
  getSubscriptionsAsJson: () => string;
  getSubscriptionCount: () => number | null;
}

let globalSubscriptionCount: number | null = null; // Global variable for subscription count
let globalSubscriptions: Subscription[] | null = null; // Global variable for subscription list

const useSubscriptions = (
  accessToken: string | null
): UseSubscriptionsResult => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  // Function to fetch channel details
  const fetchChannelDetails = useCallback(
    async (channelId: string): Promise<Subscription | null> => {
      if (!accessToken) return null;

      try {
        const response = await fetch(`${CHANNEL_DETAILS_API}${channelId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching channel details: ${response.status}`);
        }

        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const channelData = data.items[0];
          return {
            id: channelData.id,
            snippet: channelData.snippet,
            statistics: channelData.statistics,
          };
        }
      } catch (error) {
        console.error('Failed to fetch channel details:', error);
      }
      return null;
    },
    [accessToken]
  );

  // Function to fetch subscriptions from API
  const fetchSubscriptions = useCallback(async () => {
    if (!accessToken) return;

    try {
      const allSubscriptions: Subscription[] = [];
      let nextPageToken: string | null = null;

      do {
        const response = await fetch(
          `${SUBSCRIPTIONS_API}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const subscriptionsWithDetails = await Promise.all(
          (data.items || []).map(async (sub: Subscription) => {
            const channelId = sub.snippet.resourceId.channelId;
            const channelDetails = await fetchChannelDetails(channelId);
            return {
              ...sub,
              statistics: channelDetails?.statistics,
            };
          })
        );

        allSubscriptions.push(...subscriptionsWithDetails);
        nextPageToken = data.nextPageToken || null;
      } while (nextPageToken);

      setSubscriptions(allSubscriptions);
      globalSubscriptions = allSubscriptions; // Update global subscription list
      globalSubscriptionCount = allSubscriptions.length; // Update global subscription count
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
      globalSubscriptions = null;
      globalSubscriptionCount = null; // Set to null on error
    }
  }, [accessToken, fetchChannelDetails]);

  // Fetch subscriptions on initial render or when accessToken changes
  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Function to return subscriptions as JSON
  const getSubscriptionsAsJson = (): string => {
    return JSON.stringify(subscriptions, null, 2);
  };

  // Function to return subscription count
  const getSubscriptionCount = (): number | null => {
    return globalSubscriptionCount;
  };

  return {
    subscriptions,
    fetchSubscriptions,
    getSubscriptionsAsJson,
    getSubscriptionCount,
  };
};

export default useSubscriptions;
export { globalSubscriptionCount, globalSubscriptions };
