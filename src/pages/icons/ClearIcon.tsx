import React from 'react';

const ClearIcon: React.FC<ClearIconProps> = ({ onClick }) => (
    <svg onClick={onClick} className="icon clear-icon" viewBox="0 0 24 24">
        <path d="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.12 5.71A1 1 0 105.7 7.12L10.59 12l-4.88 4.88a1 1 0 101.41 1.41L12 13.41l4.88 4.88a1 1 0 001.41-1.41L13.41 12l4.88-4.88a1 1 0 000-1.41z"/>
    </svg>
);

interface ClearIconProps {
    onClick: () => void;
}

export default ClearIcon;
