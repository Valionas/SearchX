import React from 'react';

const KeyboardIcon: React.FC<KeyBoardIconProps> = ({ onClick }) => (
    <svg onClick={onClick} className="icon keyboard-icon" viewBox="0 0 24 24">
        <path d="M20 5H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2zm0 12H4V7h16zm-10-2h-2v-2h2zm0-4h-2V9h2zm4 4h-2v-2h2zm-4 0H8v-2h2zm-2-4H6V9h2zm4 4h-2v-2h2zm4 4h-2v-2h2zm0-4h-2v-2h2zm-2-4h-2V9h2zm4 4h-2v-2h2zm0-4h-2V9h2zM6 13h2v2H6zm2 0H6v-2h2z"/>
    </svg>
);

interface KeyBoardIconProps {
    onClick: () => void;
}

export default KeyboardIcon;
