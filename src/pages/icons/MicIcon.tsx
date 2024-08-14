import React from 'react';

const MicIcon: React.FC<MicIconProps> = ({ onClick }) => (
    <svg onClick={onClick} className="icon mic-icon" viewBox="0 0 24 24">
        <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zM19 11v1a7 7 0 01-14 0v-1a1 1 0 00-2 0v1a9 9 0 0018 0v-1a1 1 0 00-2 0z"/>
    </svg>
);

interface MicIconProps {
    onClick: () => void;
}

export default MicIcon;
