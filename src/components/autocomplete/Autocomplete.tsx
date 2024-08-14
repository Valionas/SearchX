import React, { useState, useEffect } from 'react';
import './Autocomplete.css';
import SearchIcon from '../../pages/icons/SearchIcon';

const Autocomplete: React.FC<AutocompleteProps> = ({ query, results, onSelect, onClear }) => {
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

    return (
        <div className="autocomplete-container">
            {filteredResults.length > 0 ? (
                <div className="autocomplete-dropdown">
                    {filteredResults.map((result) => (
                        <div
                            key={result.id}
                            className="autocomplete-item"
                            onClick={() => onSelect(result)}
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
                        onClick={() => onSelect({ id: 0, title: query, url: '', description: '' })}
                    >
                        Search for "{query}"
                    </div>
                </div>
            ) : null}
        </div>
    );
};

interface SearchResult {
    id: number;
    title: string;
    url: string;
    description: string;
}

interface AutocompleteProps {
    query: string;
    results: SearchResult[];
    onSelect: (selectedResult: SearchResult) => void;
    onClear: () => void;
}

export default Autocomplete;
