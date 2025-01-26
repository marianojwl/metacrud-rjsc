import React, { useState, useEffect } from 'react';
import './SearchboxTimeout.css';

const SearchboxTimeout = ({
  value = '',
  setValue,
  placeholder = 'Buscar...',
  readOnly = false,
  delay = 900,
  autoFocus=true,
  className="SearchBoxInput"
}) => {
  const [searchQuery, setSearchQuery] = useState(value);
  const [timeoutId, setTimeoutId] = useState(null);
  const [containerClass, setContainerClass] = useState('SearchBoxContainer');

  // Sync the local state with the prop value
  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  // Handle input changes
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setSearchQuery(newValue);

    // Clear any existing timeout when input changes
    if (timeoutId) {
      clearTimeout(timeoutId);
      setContainerClass('MetaCrudSearchBoxContainer');
    }
  };

  // Clear the search input
  const handleClearButtonClick = () => {
    setSearchQuery('');
  };

  // Focus on the input when the component mounts
  /*
  useEffect(() => {
    if (autoFocus)
      document.querySelector('.ImageBarMenuSearchInput').focus();
  }, []);
  */

  // Handle delayed search trigger
  useEffect(() => {
    setContainerClass('MetaCrudSearchBoxContainerAnimated');
    
    // Set up a delayed action for handling the search
    const id = setTimeout(() => {
      setValue(searchQuery);
      setContainerClass('MetaCrudSearchBoxContainer');
    }, delay);

    // Save the timeout ID to clear it if needed
    setTimeoutId(id);

    // Clear timeout on cleanup if the component re-renders
    return () => clearTimeout(id);
  }, [searchQuery, setValue]);

  return (
    <div className='position-relative d-inline-block mb-2'>
      <span className={"material-symbols-outlined position-absolute"+(searchQuery===""?' text-muted':' text-primary')} style={{margin:"0.475rem 0.7rem"}}>search</span>
       <input
          readOnly={readOnly}
          autoFocus={autoFocus}
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          id='search' type='text' 
          className={'form-control MetaCrudSearchBoxInput'+(searchQuery===""?'':' border-primary')}
          style={{padding:"8.4px 0.5rem 5px 2.5rem"}} 
        />

        {searchQuery && (
        <button
          className="btn text-muted float-end position-absolute"
          style={{
            right: "0rem", // Position to the right
            top: "50%",
            transform: "translateY(-50%)", // Center vertically
            background: "none",
            border: "none",
            fontSize: "1.8rem",
            cursor: "pointer",
          }}
          onClick={handleClearButtonClick}
          aria-label="Clear"
        ><span className={"material-symbols-outlined "+(searchQuery===""?'text-muted':'text-danger')}>backspace</span></button>
      )}
      <div className={containerClass}></div>
    </div>
  );
};

export default SearchboxTimeout;
