import React from 'react';
import { UserFilters as UserFiltersType } from '../../types/models';

interface UserFiltersProps {
  searchInputs: {
    name: string;
    email: string;
  };
  filters: UserFiltersType;
  showSuggestions: {
    names: boolean;
    emails: boolean;
  };
  suggestions: {
    names: string[];
    emails: string[];
  };
  onSearchInputChange: (field: string, value: string) => void;
  onFilterChange: (field: string, value: string) => void;
  onSuggestionClick: (field: string, value: string) => void;
  onShowSuggestionsChange: (field: string, show: boolean) => void;
  onClearFilters: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchInputs,
  filters,
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
      <div className="col-md-3">
        <div className="position-relative">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by name"
            value={searchInputs.name}
            onChange={(e) => onSearchInputChange('name', e.target.value)}
            onFocus={() => onShowSuggestionsChange('names', true)}
            onBlur={() => setTimeout(() => onShowSuggestionsChange('names', false), 200)}
          />
          {showSuggestions.names && suggestions.names.length > 0 && (
            <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm" style={{ zIndex: 1000 }}>
              {suggestions.names.map((name, index) => (
                <div
                  key={index}
                  className="px-3 py-2 cursor-pointer hover:bg-light"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSuggestionClick('name', name)}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="col-md-3">
        <div className="position-relative">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by email"
            value={searchInputs.email}
            onChange={(e) => onSearchInputChange('email', e.target.value)}
            onFocus={() => onShowSuggestionsChange('emails', true)}
            onBlur={() => setTimeout(() => onShowSuggestionsChange('emails', false), 200)}
          />
          {showSuggestions.emails && suggestions.emails.length > 0 && (
            <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm" style={{ zIndex: 1000 }}>
              {suggestions.emails.map((email, index) => (
                <div
                  key={index}
                  className="px-3 py-2 cursor-pointer hover:bg-light"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSuggestionClick('email', email)}
                >
                  {email}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="col-md-3">
        <select
          className="form-control"
          value={filters.role || ''}
          onChange={(e) => onFilterChange('role', e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
      </div>
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

export default UserFilters;
