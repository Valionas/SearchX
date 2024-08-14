import React, { useState } from 'react';
import SearchResultItem from './SearchResultItem';
import { SearchResult } from '../../../models/SearchResult';
import './SearchResults.css';

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const resultsPerPage = 10; // Number of results per page

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

    const totalPages = Math.ceil(results.length / resultsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="search-results">
            {currentResults.map((result) => (
                <SearchResultItem key={result.id} result={result} />
            ))}
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    {"<"}
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    {">"}
                </button>
            </div>
        </div>
    );
};

interface SearchResultsProps {
    results: SearchResult[];
}

export default SearchResults;
