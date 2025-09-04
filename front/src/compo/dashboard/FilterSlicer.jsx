import React, { useState, useEffect } from 'react';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';

const FilterModal = ({ slicers, onApply, activeFilters, onClose }) => {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setFilters(JSON.parse(JSON.stringify(activeFilters || {})));
  }, [activeFilters]);

  const handleChange = (column, type, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (type === 'categorical') {
        newFilters[column] = newFilters[column] || [];
        if (newFilters[column].includes(value)) {
          newFilters[column] = newFilters[column].filter(item => item !== value);
        } else {
          newFilters[column] = [...newFilters[column], value];
        }
      } else {
        newFilters[column] = { ...newFilters[column], ...value };
      }
      return newFilters;
    });
  };
  
  const handleClearFilters = () => {
    setFilters({});
  };

  const handleApply = () => {
    // Call the onApply function to apply the filters
    onApply(filters);
    
    // Call the onClose function to close the modal after applying
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#212121d8] p-6 rounded-2xl shadow-2xl w-full max-w-4xl border border-slate-700">
        <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <HiOutlineAdjustmentsHorizontal className="mr-3 text-cyan-400" />
            Advanced Filters
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-transform transform hover:rotate-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap gap-6 mb-6 overflow-y-auto max-h-[60vh]">
          {slicers && Object.entries(slicers).map(([column, config]) => (
            <div key={column} className="flex-1 min-w-[200px] p-4 border border-slate-800 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors duration-200">
              <label className="block text-slate-200 font-semibold mb-2 text-sm">{column}</label>
              {config.type === 'categorical' && (
                <div className="flex flex-wrap gap-2">
                  {config.options.map(option => (
                    <button
                      key={option}
                      onClick={() => handleChange(column, 'categorical', option)}
                      className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                        filters[column]?.includes(option)
                          ? 'bg-cyan-600 text-white border-cyan-600 shadow-lg'
                          : 'bg-slate-700 text-slate-300 border-slate-700 hover:bg-cyan-800 hover:text-white'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              {config.type === 'numeric' && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="any"
                    value={filters[column]?.min || ''}
                    placeholder={`Min: ${config.min}`}
                    className="w-1/2 p-2 bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500 text-sm"
                    onChange={(e) => handleChange(column, 'numeric', { min: parseFloat(e.target.value) })}
                  />
                  <span className="text-white">-</span>
                  <input
                    type="number"
                    step="any"
                    value={filters[column]?.max || ''}
                    placeholder={`Max: ${config.max}`}
                    className="w-1/2 p-2 bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500 text-sm"
                    onChange={(e) => handleChange(column, 'numeric', { max: parseFloat(e.target.value) })}
                  />
                </div>
              )}
              {config.type === 'date' && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={filters[column]?.min || ''}
                    className="w-1/2 p-2 bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    onChange={(e) => handleChange(column, 'date', { min: e.target.value })}
                  />
                  <span className="text-white">-</span>
                  <input
                    type="date"
                    value={filters[column]?.max || ''}
                    className="w-1/2 p-2 bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    onChange={(e) => handleChange(column, 'date', { max: e.target.value })}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
          >
            Clear Filters
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;