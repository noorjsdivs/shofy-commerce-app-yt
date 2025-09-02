"use client";
import { useState, useRef, useEffect } from "react";
import { IoChevronDownSharp } from "react-icons/io5";
import { FiCheck } from "react-icons/fi";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸", available: true },
  { code: "es", name: "Español", flag: "🇪🇸", available: false },
  { code: "fr", name: "Français", flag: "🇫🇷", available: false },
  { code: "de", name: "Deutsch", flag: "🇩🇪", available: false },
  { code: "ja", name: "日本語", flag: "🇯🇵", available: false },
];

const LanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (language: (typeof languages)[0]) => {
    // Only allow selection if language is available
    if (!language.available) return;
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="headerTopMenu cursor-pointer hover:text-orange-300 transition-colors flex items-center gap-1"
      >
        <span className="hidden sm:inline">{selectedLanguage.flag}</span>
        <span className="hidden md:inline">{selectedLanguage.name}</span>
        <span className="md:hidden">EN</span>
        <IoChevronDownSharp
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-52 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 z-50 py-2"
          style={{ backdropFilter: "blur(8px)" }}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              disabled={!language.available}
              className={`w-full px-4 py-2 text-left flex items-center justify-between transition-colors ${
                language.available
                  ? "text-gray-700 hover:bg-gray-50 cursor-pointer"
                  : "text-gray-400 cursor-not-allowed bg-gray-50/50"
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <span className={language.available ? "" : "opacity-50"}>
                  {language.flag}
                </span>
                <span className="text-sm">{language.name}</span>
                {!language.available && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {selectedLanguage.code === language.code &&
                  language.available && (
                    <FiCheck className="text-theme-color text-sm" />
                  )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
