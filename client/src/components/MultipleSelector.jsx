import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './MultipleSelector.scss';

const MultipleSelector = ({ defaultOptions, placeholder, value, onChange, emptyIndicator }) => {
    const [searchText, setSearchText] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(defaultOptions);

    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredOptions(defaultOptions);
        } else {
            const lowerCaseSearch = searchText.toLowerCase();
            const filtered = defaultOptions.filter(option =>
                option.name.toLowerCase().includes(lowerCaseSearch)
            );
            setFilteredOptions(filtered);
        }
    }, [searchText, defaultOptions]);

    const handleSelect = (contact) => {
        if (!value.includes(contact)) {
            onChange([...value, contact]);
        }
    };

    const handleRemove = (contact) => {
        const updatedSelection = value.filter(selected => selected.id !== contact.id);
        onChange(updatedSelection);
    };

    return (
        <div className="multiple-selector">
            <div className="selected-items">
                {value.map(contact => (
                    <div key={contact.id} className="selected-item">
                        {contact.name}
                        <button
                            className="remove-btn"
                            onClick={() => handleRemove(contact)}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>

            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />

            <div className="options-list">
                {filteredOptions.length > 0 ? (
                    filteredOptions.map(contact => (
                        <div
                            key={contact.id}
                            className="option-item"
                            onClick={() => handleSelect(contact)}
                        >
                            {contact.name}
                        </div>
                    ))
                ) : (
                    <div className="empty-indicator">{emptyIndicator}</div>
                )}
            </div>
        </div>
    );
};

MultipleSelector.propTypes = {
    defaultOptions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    emptyIndicator: PropTypes.node,
};

MultipleSelector.defaultProps = {
    placeholder: 'Search...',
    emptyIndicator: <p>No results found.</p>,
};

export default MultipleSelector;
