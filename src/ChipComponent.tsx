// src/ChipComponent.tsx

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import md5 from 'md5'; // Import md5 library for Gravatar integration
import './ChipComponent.css';

interface Chip {
  id: number;
  label: string;
  email: string;
}

const ChipComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [chips, setChips] = useState<Chip[]>([]);
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [highlightedChip, setHighlightedChip] = useState<Chip | null>(null);
  const [items, setItems] = useState<string[]>([
    'Nick Giannopoulos',
    'John Doe',
    'Jane Doe',
    'Alice',
    'Bob'
  ]); // Sample list of items
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Filter items based on input value
    const filtered = items.filter(item =>
      item.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [inputValue, chips]);

  const generateEmail = (label: string) => {
    return `${label.replace(/\s+/g, '.').toLowerCase()}@abc.com`;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setHighlightedChip(null); // Remove highlight when input changes
  };

  const handleItemClick = (item: string) => {
    // Check if a chip with the same label already exists
    if (chips.some(chip => chip.label === item)) {
      return;
    }

    const email = generateEmail(item);
    setChips(prevChips => [
      ...prevChips,
      { id: Date.now(), label: item, email }
    ]);
    setInputValue('');
    inputRef.current?.focus();
    // Remove the item from the filtered items list
    setFilteredItems(prevItems =>
      prevItems.filter(filteredItem => filteredItem !== item)
    );
    // Also remove the item from items
    setItems(prevItems => prevItems.filter(i => i !== item));
  };

  const handleChipRemove = (id: number) => {
    const removedChip = chips.find(chip => chip.id === id);
    if (removedChip) {
      setChips(prevChips => prevChips.filter(chip => chip.id !== id));
      setFilteredItems(prevItems => [...prevItems, removedChip.label]);
      setItems(prevItems => [...prevItems, removedChip.label]);
    }
  };

  const handleInputKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && inputValue === '') {
      if (highlightedChip) {
        // If a chip is already highlighted, delete it
        handleChipRemove(highlightedChip.id);
        setHighlightedChip(null);
      } else if (chips.length > 0) {
        // If no chip is highlighted, highlight the last chip
        const lastChip = chips[chips.length - 1];
        setHighlightedChip(lastChip);
      }
    } else {
      // If any other key is pressed, remove the highlight
      setHighlightedChip(null);
    }
  };

  const handleItemSelect = (item: string) => {
    handleItemClick(item);
  };

  return (
    <div className="chip-container">
      <div className="chips">
        {chips.map(chip => (
          <div
            key={chip.id}
            className={`chip ${chip === highlightedChip ? 'highlighted' : ''}`}
          >
            <div className="avatar-container">
              <img
                src={`https://www.gravatar.com/avatar/${md5(
                  chip.email
                )}?d=identicon&s=20`}
                alt="avatar"
                className="avatar"
              />
            </div>
            {chip.label}
            <div className="chip-email">{chip.email}</div>
            <button onClick={() => handleChipRemove(chip.id)}>&times;</button>
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleInputKeyPress}
        placeholder="Type to filter items"
      />
      <ul className="item-list">
        {filteredItems.map(item => (
          <li key={item} onClick={() => handleItemSelect(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChipComponent;
