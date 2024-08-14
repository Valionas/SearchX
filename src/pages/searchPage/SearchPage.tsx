import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClearIcon from '../icons/ClearIcon';
import MicIcon from '../icons/MicIcon';
import MicMuteIcon from '../icons/MicMuteIcon';
import SearchIcon from '../icons/SearchIcon';
import KeyboardIcon from '../icons/KeyboardIcon';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './Search.css';
import Autocomplete from '../../components/autocomplete/Autocomplete';

const SearchPage: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [isListening, setIsListening] = useState<boolean>(false);
    const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [results, setResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/items')
            .then((response) => response.json())
            .then((data) => setResults(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const handleClearInput = () => {
        setQuery('');
    };

    const handleSelectResult = (selectedResult: SearchResult) => {
        setQuery(selectedResult.title);
        window.open(selectedResult.url, '_blank');
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const newRecognition = new SpeechRecognition();
            newRecognition.lang = 'en-US';
            newRecognition.interimResults = false;
            newRecognition.maxAlternatives = 1;

            newRecognition.onstart = () => {
                setIsListening(true);
            };

            newRecognition.onresult = (event: SpeechRecognitionEvent) => {
                let speechResult = event.results[0][0].transcript;
                speechResult = speechResult.replace(/[.,!?;:]$/, '');
                setQuery(speechResult);
            };

            newRecognition.onspeechend = () => {
                stopListening();
            };

            newRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error detected: ' + event.error);
                stopListening();
            };

            newRecognition.start();
            setRecognition(newRecognition);
        } else {
            console.error('Speech recognition not supported in this browser.');
        }
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
            setRecognition(null);
        }
        setIsListening(false);
    };

    const handleKeyboardInput = (input: string) => {
        setQuery((prev) => prev + input);
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
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
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
                    <motion.input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className={`search-input ${query ? 'search-input-active' : ''}`}
                        placeholder="Search..."
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 0.6 }}
                    />
                    <Autocomplete
                        query={query}
                        results={results}
                        onSelect={handleSelectResult}
                        onClear={handleClearInput}
                    />
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
        </motion.div>
    );
};

interface SearchResult {
    id: number;
    title: string;
    url: string;
    description: string;
}

export default SearchPage;
