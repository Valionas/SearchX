import React from 'react';

const MicMuteIcon: React.FC<MicMuteIconProps> = ({ onClick }) => (
    <svg onClick={onClick} className="icon mic-icon" viewBox="0 0 24 24">
        <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zM19 11v1a7 7 0 01-14 0v-1a1 1 0 00-2 0v1a9 9 0 0018 0v-1a1 1 0 00-2 0z"/>
        <path d="M4.21 4.21a1 1 0 011.42 0l14.14 14.14a1 1 0 01-1.42 1.42L4.21 5.63a1 1 0 010-1.42z"/>
    </svg>
);

interface MicMuteIconProps {
    onClick: () => void;
}

export default MicMuteIcon;
