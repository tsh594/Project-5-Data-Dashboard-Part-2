import { useState, useEffect, useRef } from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, loading }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const suggestionsRef = useRef(null);
  const [apiKeyIndex, setApiKeyIndex] = useState(0);

  const API_KEYS = [
    import.meta.env.VITE_APP_OWM_KEY,
    import.meta.env.VITE_APP_SECOND_ALTERNATIVE_API_KEY
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentWeatherSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const fetchSuggestionsWithFallback = async (query, attempt = 0) => {
    try {
      if (query.trim().length < 2) {
        setSuggestions(recentSearches.filter(search => 
          search.toLowerCase().includes(query.toLowerCase())
        ));
        return;
      }
      
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEYS[apiKeyIndex]}`
      );
      
      if (!res.ok) throw new Error('API error');
      
      const data = await res.json();
      setSuggestions(data.map(({ name, state, country }) => 
        `${name}${state ? `, ${state}` : ''}, ${country}`
      ));
    } catch (err) {
      if (attempt < API_KEYS.length - 1) {
        console.log(`Trying fallback API key (attempt ${attempt + 1})`);
        setApiKeyIndex(prev => (prev + 1) % API_KEYS.length);
        return fetchSuggestionsWithFallback(query, attempt + 1);
      }
      console.error('Suggestions error:', err);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSuggestionsWithFallback(inputValue);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputValue, apiKeyIndex]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchQuery(inputValue);
      setSuggestions([]);
      
      const updatedSearches = [
        inputValue,
        ...recentSearches.filter(search => search !== inputValue)
      ].slice(0, 5);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentWeatherSearches', JSON.stringify(updatedSearches));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setInputValue(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="search-container">
      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search city..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="glow-input"
        />
        <button 
          type="submit"
          className="search-btn"
          disabled={loading || !inputValue.trim()}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {suggestions.length > 0 && (
        <div className="suggestions-dropdown" ref={suggestionsRef}>
          {suggestions.map((suggestion, i) => (
            <div
              key={i}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;