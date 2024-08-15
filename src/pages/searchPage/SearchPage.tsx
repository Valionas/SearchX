import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import ClearIcon from '../icons/ClearIcon';
import MicIcon from '../icons/MicIcon';
import MicMuteIcon from '../icons/MicMuteIcon';
import SearchIcon from '../icons/SearchIcon';
import KeyboardIcon from '../icons/KeyboardIcon';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './SearchPage.css';
import Autocomplete from '../../components/autocomplete/Autocomplete';
import SearchResults from './searchResults/SearchResults';
import { SearchResult } from '../../models/SearchResult';
import { startSpeechRecognition, stopSpeechRecognition } from '../../utils/speechRecognitionUtils';
import { SearchHistoryContext } from '../../context/SearchHistoryContext';

const SearchPage: React.FC = () => {
    const { searchHistory, addToSearchHistory, removeFromSearchHistory } = useContext(SearchHistoryContext);

    const [query, setQuery] = useState<string>('');
    const [isListening, setIsListening] = useState<boolean>(false);
    const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [filteredAutocompleteItems, setFilteredAutocompleteItems] = useState<SearchResult[]>([]);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]); // Separate state for search results
    const [showResults, setShowResults] = useState<boolean>(false);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [searchTime, setSearchTime] = useState<number>(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const keyboardRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        fetch('http://localhost:5000/items')
            .then((response) => response.json())
            .then((data) => setResults(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Add the event listener on mount
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                inputRef.current &&
                dropdownRef.current &&
                !inputRef.current.contains(event.target as Node) &&
                !dropdownRef.current.contains(event.target as Node) &&
                !keyboardRef.current?.contains(event.target as Node)

            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        
        // Cleanup event listener on unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const stopListening = useCallback(() => {
        stopSpeechRecognition(recognition, setIsListening, setRecognition);
    }, [recognition]);

    const startListening = useCallback(() => {
        startSpeechRecognition(setIsListening, setQuery, stopListening, setRecognition);
    }, [stopListening]);

    const handleClearInput = () => {
        setQuery('');
        setShowDropdown(false);
    };
    const handleSelectResult = (selectedResult: SearchResult) => {
        setQuery(selectedResult.title);
    
        // Only add to search history if the item exists in the database (i.e., id is not -1)
        if (selectedResult.id !== -1) {
            addToSearchHistory(selectedResult);
        }
    
        // Filter the results based on the selected item
        const relatedResults = results.filter((item) =>
            item.title.toLowerCase().includes(selectedResult.title.toLowerCase())
        );
    
        setSearchResults(relatedResults); // Update search results only on selection
        setShowResults(true); 
        setShowDropdown(false);
    };
    
    
    const handleSearch = () => {
        const startTime = window.performance.now();

        const filteredResults = results.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );

        const endTime = window.performance.now();
        const timeTaken = endTime - startTime;

        setSearchResults(filteredResults); // Update search results only on search (Enter key)
        setShowResults(true);
        setShowDropdown(false);
        setSearchTime(timeTaken);

        const matchedResult = filteredResults.find((item) =>
            item.title.toLowerCase() === query.toLowerCase()
        );
        if (matchedResult) {
            addToSearchHistory(matchedResult);
        }
    };

    const handleKeyboardInput = (input: string) => {
        setQuery((prev) => prev + input);
        setShowDropdown(true);
    };

    const handleAutocompleteChange = (query: string) => {
        setFilteredAutocompleteItems(results.filter((item) =>
            item.title.toLowerCase().startsWith(query.toLowerCase())
        ));
    };

    return (
        <motion.div
            className="search-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
        >
            <motion.h1
                className="search-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.2 }}
            >
                SearchX
            </motion.h1>
            {showKeyboard && (
                <div ref={keyboardRef}>
                    <Keyboard onKeyPress={(button: string) => handleKeyboardInput(button)} />
                </div>
               
            )}
            {isListening && (
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666', textAlign: 'center', fontWeight: 'bold' }}>
                    Listening<span className="listening-dots"></span>
                </div>
            )}
            <motion.div
                className='search-box'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.4 }}
            >
                <div className="input-container">
                    <SearchIcon />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            handleAutocompleteChange(e.target.value);
                            setShowDropdown(true);
                        }}
                        className={`search-input ${query ? 'search-input-active' : ''}`}
                        placeholder="Search..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        onFocus={() => setShowDropdown(true)} // Show dropdown on input focus
                    />
                    {showDropdown && (
                        <div ref={dropdownRef}>
                            <Autocomplete
                                onRemove={removeFromSearchHistory}
                                searchHistory={searchHistory}
                                query={query}
                                results={filteredAutocompleteItems} // Pass filteredAutocompleteItems to Autocomplete
                                onSelect={handleSelectResult}
                                onClose={() => setShowDropdown(false)}
                            />
                        </div>
                    )}
                </div>
                <div className="icons-container">
                    {query && <ClearIcon onClick={handleClearInput} />}
                    <KeyboardIcon onClick={() => setShowKeyboard(!showKeyboard)} />
                    {isListening ? (
                        <MicMuteIcon onClick={stopListening} />
                    ) : (
                        <MicIcon onClick={startListening} />
                    )}
                </div>
            </motion.div>
            {showResults && (
                <div className="result-metadata">
                    {searchResults.length} results found in {(searchTime / 1000).toFixed(2)} seconds
                </div>
            )}
            {showResults && <SearchResults results={searchResults} searchHistory={searchHistory} />}
        </motion.div>
    );
};

export default SearchPage;
