import React, { useState, useEffect } from 'react';
import './Autocomplete.css';
import SearchIcon from '../../pages/icons/SearchIcon';
import ClockIcon from '../../pages/icons/ClockIcon';
import { SearchResult } from '../../models/SearchResult';

const Autocomplete: React.FC<AutocompleteProps> = ({ query, results, onSelect, onClose, searchHistory, onRemove }) => {
    const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);

    const handleRemove = (event: React.MouseEvent, id: number) => {
        event.preventDefault();
        event.stopPropagation();
        onRemove(id);
    };

    useEffect(() => {
        if (query) {
            // Filter out results that are already in the search history
            const filtered = results
                .filter((result) =>
                    result.title.toLowerCase().startsWith(query.toLowerCase()) &&
                    !searchHistory.some(item => item.id === result.id)
                );

            // Combine search history at the top with new filtered results
            const combinedResults = [
                ...searchHistory.filter((item) =>
                    item.title.toLowerCase().startsWith(query.toLowerCase())
                ),
                ...filtered,
            ];

            setFilteredResults(combinedResults);
        } else {
            setFilteredResults([]);
        }
    }, [query, results, searchHistory]);

    return (
        <div className="autocomplete-container">
            {filteredResults.length > 0 && (
                <div className="autocomplete-dropdown">
                    {filteredResults.map((result) => (
                        <div
                            key={result.id}
                            className={`autocomplete-item ${searchHistory.some(item => item.id === result.id) ? 'autocomplete-item-searched' : ''}`}
                            onClick={() => {
                                onSelect(result);
                                onClose();
                            }}
                        >
                            <div className='icon-label-search'>
                                {searchHistory.some(item => item.id === result.id) ? <ClockIcon /> : <SearchIcon />}
                                {result.title}
                            </div>
                            {searchHistory.some(item => item.id === result.id) && (
                                <span
                                    className="remove-label"
                                    onClick={(event) => handleRemove(event, result.id)}
                                >
                                    Remove
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface AutocompleteProps {
    query: string;
    results: SearchResult[];
    onSelect: (selectedResult: SearchResult) => void;
    onClose: () => void;
    searchHistory: SearchResult[]; 
    onRemove: (id: number) => void; 
}

export default Autocomplete;