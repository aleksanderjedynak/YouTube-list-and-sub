import { useState, useEffect } from 'react';

const CLIENT_ID = import.meta.env.VITE_YOUTUBE_CLIENT_ID;
const REDIRECT_URI = window.location.origin;
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ');

const AUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(
  SCOPES
)}&response_type=token&prompt=consent`;

interface UserInfo {
  name: string;
  email: string;
  picture: string;
  id: string;
  locale: string;
  [key: string]: any;
}

export interface UseAuthResult {
  accessToken: string | null;
  userInfo: UserInfo | null;
  handleLogin: () => void;
  handleLogout: (navigate: (path: string) => void) => void;
}

const useAuth = (): UseAuthResult => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = new URLSearchParams(hash.substring(1)).get('access_token');
      if (token) {
        setAccessToken(token);
        localStorage.setItem('youtube_access_token', token);
        window.location.hash = '';
      }
    } else {
      const storedToken = localStorage.getItem('youtube_access_token');
      if (storedToken) {
        setAccessToken(storedToken);
      }
    }
  }, []);

  useEffect(() => {
    const cachedUserInfo = localStorage.getItem('youtube_user_info');
    if (cachedUserInfo) {
      setUserInfo(JSON.parse(cachedUserInfo));
    } else if (accessToken) {
      const fetchUserInfo = async () => {
        try {
          const response = await fetch(
            'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setUserInfo(data);
            localStorage.setItem('youtube_user_info', JSON.stringify(data));
          } else {
            console.error(
              'Failed to fetch user info. Status:',
              response.status
            );
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };
      fetchUserInfo();
    }
  }, [accessToken]);

  const handleLogin = (): void => {
    window.location.href = AUTH_URL;
  };

  const handleLogout = (navigate: (path: string) => void): void => {
    localStorage.removeItem('youtube_access_token');
    localStorage.removeItem('youtube_user_info');
    setAccessToken(null);
    setUserInfo(null);
    navigate('/');
  };

  return { accessToken, userInfo, handleLogin, handleLogout };
};

export default useAuth;
