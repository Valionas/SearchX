import React from 'react';
import { SearchResult } from '../../../models/SearchResult';
import './SearchResults.css';

const SearchResultItem: React.FC<SearchResultItemProps> = ({ result }) => {
    return (
        <div className="search-result-item">
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="result-title">
                {result.title}
            </a>
            <p className="result-description">{result.description}</p>
        </div>
    );
};

interface SearchResultItemProps {
    result: SearchResult;
}

export default SearchResultItem;
