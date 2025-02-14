import React, { FC } from 'react';

interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select';
  options?: { value: string; label: string }[];
}

interface GenericFiltersProps<T> {
  searchInputs: { [key: string]: string };
  filters: { [key: string]: string };
  filterFields: FilterField[];
  showSuggestions: { [key: string]: boolean };
  suggestions: { [key: string]: string[] };
  onSearchInputChange: (field: string, value: string) => void;
  onFilterChange: (field: string, value: string) => void;
  onSuggestionClick: (field: string, value: string) => void;
  onShowSuggestionsChange: (field: string, show: boolean) => void;
  onClearFilters: () => void;
}

const GenericFilters: FC<GenericFiltersProps<any>> = ({
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
            {field.type === 'text' ? (
              <>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Filter by ${field.label.toLowerCase()}`}
                  value={searchInputs[field.key] || ''}
                  onChange={(e) => onSearchInputChange(field.key, e.target.value)}
                  onFocus={() => onShowSuggestionsChange(field.key, true)}
                  onBlur={() => setTimeout(() => onShowSuggestionsChange(field.key, false), 200)}
                />
                {showSuggestions[field.key] && suggestions[field.key]?.length > 0 && (
                  <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm" style={{ zIndex: 1000 }}>
                    {suggestions[field.key].map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 cursor-pointer hover:bg-light"
                        style={{ cursor: 'pointer' }}
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
                className="form-control"
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
      <div className="col-md-3">
        <button 
          className="btn btn-secondary"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default GenericFilters;
