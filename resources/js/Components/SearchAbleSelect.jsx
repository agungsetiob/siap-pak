import { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, CheckCircle } from "lucide-react";

export default function SearchableSelect({
  options = [],
  value,
  onChange,
  label,
  placeholder,
  displayValue,
  required = false,
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter((option) =>
      displayValue(option).toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search, displayValue]);

  const displayString = value ? displayValue(value) : "";

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative mt-1">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10" />

        <input
          type="text"
          className="pl-10 pr-10 block w-full rounded-xl border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4 text-sm cursor-pointer"
          placeholder={placeholder}
          value={isOpen ? search : displayString}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearch("");
          }}
          readOnly={!isOpen && !!value}
        />

        <ChevronDown
          className={`absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => (
                <div
                  key={option.id || idx}
                  className={`px-4 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors duration-150 border-b border-gray-50 last:border-0 ${
                    value?.id === option.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  }`}
                  onClick={() => {
                    onChange(option);
                    setSearch("");
                    setIsOpen(false);
                  }}
                >
                  <div className="font-medium text-sm flex items-center gap-2">
                    {value?.id === option.id && (
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    {displayValue(option)}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-sm text-gray-400 text-center flex flex-col items-center">
                <Search className="w-6 h-6 mb-2 opacity-20" />
                Tidak ditemukan
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
