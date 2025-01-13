import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export type Channel = {
  id: string;
  [key: string]: any;
};

type Lists = {
  [key: string]: Channel[];
};

const useChannelLists = () => {
  const [lists, setLists] = useState<Lists>(() => {
    const savedLists = localStorage.getItem('lists');
    return savedLists ? JSON.parse(savedLists) : {};
  });

  useEffect(() => {
    if (Object.keys(lists).length > 0) {
      localStorage.setItem('lists', JSON.stringify(lists));
    } else {
      localStorage.removeItem('lists');
    }
  }, [lists]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'lists') {
        const updatedLists = localStorage.getItem('lists');
        setLists(updatedLists ? JSON.parse(updatedLists) : {});
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const createList = (listName: string): void => {
    if (!listName || listName.length < 3) {
      toast.error('List name must be at least 3 characters long.');
      return;
    }
    setLists((prevLists) => {
      if (prevLists[listName]) {
        toast.error(`List "${listName}" already exists.`);
        return prevLists;
      }
      toast.success(`List "${listName}" created successfully!`);
      return { ...prevLists, [listName]: [] };
    });
  };

  const deleteList = (listName: string): void => {
    setLists((prevLists) => {
      const updatedLists = { ...prevLists };
      delete updatedLists[listName];
      toast.success(`List "${listName}" deleted successfully.`);
      return updatedLists;
    });
  };

  const toggleChannelInList = (listName: string, channel: Channel): void => {
    setLists((prevLists) => {
      const list = prevLists[listName] || [];
      const updatedList = list.some((c) => c.id === channel.id)
        ? list.filter((c) => c.id !== channel.id)
        : [...list, channel];
      return { ...prevLists, [listName]: updatedList };
    });
  };

  const getListCount = (): number => Object.keys(lists).length;

  const getChannelCountInList = (listName: string): number => {
    return lists[listName]?.length || 0;
  };

  const refreshLists = (): void => {
    const updatedLists = localStorage.getItem('lists');
    setLists(updatedLists ? JSON.parse(updatedLists) : {});
  };

  return {
    lists,
    createList,
    deleteList,
    toggleChannelInList,
    getListCount,
    getChannelCountInList,
    refreshLists,
  };
};

export default useChannelLists;
