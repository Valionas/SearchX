import React, { createContext, useState, ReactNode } from 'react';
import { SearchResult } from '../models/SearchResult';

interface SearchHistoryContextProps {
    searchHistory: SearchResult[];
    addToSearchHistory: (result: SearchResult) => void;
    removeFromSearchHistory: (id: number) => void;
}

const defaultValue: SearchHistoryContextProps = {
    searchHistory: [],
    addToSearchHistory: () => {},
    removeFromSearchHistory: () => {}
};

export const SearchHistoryContext = createContext<SearchHistoryContextProps>(defaultValue);

export const SearchHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchHistory, setSearchHistory] = useState<SearchResult[]>([]);

    const addToSearchHistory = (result: SearchResult) => {
        setSearchHistory((prevHistory) => {
            // Check if the item already exists in the history
            const exists = prevHistory.some((item) => item.id === result.id);
            if (exists) {
                return prevHistory;
            }
            return [...prevHistory, result];
        });
    };
    
    const removeFromSearchHistory = (id: number) => {
        setSearchHistory((prevHistory) => prevHistory.filter(item => item.id !== id));
    };

    return (
        <SearchHistoryContext.Provider value={{ searchHistory, addToSearchHistory, removeFromSearchHistory }}>
            {children}
        </SearchHistoryContext.Provider>
    );
};
