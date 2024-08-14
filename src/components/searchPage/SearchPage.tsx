import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ClearIcon from '../icons/ClearIcon';
import MicIcon from '../icons/MicIcon';
import MicMuteIcon from '../icons/MicMuteIcon';
import SearchIcon from '../icons/SearchIcon';
import KeyboardIcon from '../icons/KeyboardIcon';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './Search.css';

const SearchPage: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [isListening, setIsListening] = useState<boolean>(false);
    const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

    const handleClearInput = () => {
        setQuery('');
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
                const speechResult = event.results[0][0].transcript;
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
        setQuery(prev => prev + input);
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
            <motion.div
                className="search-box"
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
                        className="search-input"
                        placeholder="Search..."
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 0.6 }}
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
            {isListening && (
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    Listening<span className="listening-dots"></span>
                </div>
            )}
            {showKeyboard && (
                <Keyboard
                    onKeyPress={(button: string) => handleKeyboardInput(button)}
                />
            )}
        </motion.div>
    );
};

export default SearchPage;
