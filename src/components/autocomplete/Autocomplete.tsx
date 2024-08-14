import React, { useState, useEffect } from 'react';
import './Autocomplete.css';
import SearchIcon from '../../pages/icons/SearchIcon';
import { SearchResult } from '../../models/SearchResult';

const Autocomplete: React.FC<AutocompleteProps> = ({ query, results, onSelect, onClose }) => {
    const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        if (query) {
            const filtered = results
                .filter((result) =>
                    result.title.toLowerCase().includes(query.toLowerCase())
                )
                .slice(0, 10);
            setFilteredResults(filtered);
        } else {
            setFilteredResults([]);
        }
    }, [query, results]);

    const handleSelect = (result: SearchResult) => {
        onSelect(result);
        onClose(); 
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (filteredResults.length > 0) {
                handleSelect(filteredResults[0]); // Select the first item on Enter key press
            } else {
                handleSelect({ id: 0, title: query, url: '', description: '' }); // Handle the "Search for" scenario
            }
        }
    };

    return (
        <div className="autocomplete-container" onKeyDown={handleKeyDown}>
            {filteredResults.length > 0 ? (
                <div className="autocomplete-dropdown">
                    {filteredResults.map((result) => (
                        <div
                            key={result.id}
                            className="autocomplete-item"
                            onClick={() => handleSelect(result)}
                        >
                            <SearchIcon />
                            {result.title}
                        </div>
                    ))}
                </div>
            ) : query ? (
                <div className="autocomplete-dropdown">
                    <div
                        className="autocomplete-item search-for-item"
                        onClick={() => handleSelect({ id: 0, title: query, url: '', description: '' })}
                    >                  
                        Search for "{query}"
                    </div>
                </div>
            ) : null}
        </div>
    );
};

interface AutocompleteProps {
    query: string;
    results: SearchResult[];
    onSelect: (selectedResult: SearchResult) => void;
    onClose: () => void;
}

export default Autocomplete;
