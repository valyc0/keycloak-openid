import React from 'react';
import styles from './GenericFilters.module.css';

const GenericFilters = ({
  searchInputs,
  filters,
  filterFields,
  showSuggestions,
  suggestions,
  onSearchInputChange,
  onFilterChange,
  onSuggestionClick,
  onShowSuggestionsChange,
  onClearFilters
}) => {
  return (
    <div className="row mb-4">
      {filterFields.map(field => (
        <div key={field.key} className="col-md-3">
          <div className="position-relative">
            <label className="form-label">{field.label}</label>
            {field.type === 'text' ? (
              <>
                <input
                  type="text"
                  className={`form-control ${styles.filterInput}`}
                  placeholder={`Filter by ${field.label.toLowerCase()}`}
                  value={searchInputs[field.key] || ''}
                  onChange={(e) => onSearchInputChange(field.key, e.target.value)}
                  onFocus={() => onShowSuggestionsChange(field.key, true)}
                  onBlur={() => setTimeout(() => onShowSuggestionsChange(field.key, false), 200)}
                />
                {showSuggestions[field.key] && suggestions[field.key]?.length > 0 && (
                  <div className={`position-absolute w-100 mt-1 rounded shadow-sm ${styles.suggestionList}`} style={{ zIndex: 1000 }}>
                    {suggestions[field.key].map((suggestion, index) => (
                      <div
                        key={index}
                        className={styles.suggestionItem}
                        onClick={() => onSuggestionClick(field.key, suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : field.type === 'select' && field.options ? (
              <select
                className={`form-control ${styles.filterInput}`}
                value={filters[field.key] || ''}
                onChange={(e) => onFilterChange(field.key, e.target.value)}
              >
                <option value="">{`All ${field.label}s`}</option>
                {field.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        </div>
      ))}
      <div className="col-md-3 d-flex align-items-end">
        <button 
          className="btn btn-secondary mb-3"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default GenericFilters;