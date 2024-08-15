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
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);  // Initially false
    const [searchTime, setSearchTime] = useState<number>(0);

    const inputRef = useRef<HTMLInputElement>(null);

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
        addToSearchHistory(selectedResult); 
    
        const relatedResults = results.filter((item) =>
            item.title.toLowerCase().includes(selectedResult.title.toLowerCase())
        );
    
        setSearchResults(relatedResults);
        setShowResults(true); 
        setShowDropdown(false);
    };
    
    const handleSearch = () => {
        const startTime = performance.now();

        const filteredResults = results.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );

        const endTime = performance.now();
        const timeTaken = endTime - startTime;

        setSearchResults(filteredResults);
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
        setShowResults(false);
    };

    const handleAutocompleteChange = (query: string) => {
        setFilteredAutocompleteItems(results.filter((item) =>
            item.title.toLowerCase().startsWith(query.toLowerCase())
        ));
    };

    const handleInputFocus = () => {
        if (query) {
            handleAutocompleteChange(query);
            setShowDropdown(true);
        }
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
                <Keyboard onKeyPress={(button: string) => handleKeyboardInput(button)} />
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
                        onFocus={handleInputFocus}  // Show dropdown on input focus if query exists
                    />
                    {showDropdown && (
                        <Autocomplete
                            onRemove={removeFromSearchHistory}
                            searchHistory={searchHistory}
                            query={query}
                            results={filteredAutocompleteItems}
                            onSelect={handleSelectResult}
                            onClose={() => setShowDropdown(false)}
                        />
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
