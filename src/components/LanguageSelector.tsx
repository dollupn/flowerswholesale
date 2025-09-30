import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    {
      code: 'en' as const,
      name: 'English',
      countryCode: 'GB',
    },
    {
      code: 'fr' as const,
      name: 'Français',
      countryCode: 'FR',
    },
  ] as const;

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          {currentLanguage && (
            <ReactCountryFlag
              svg
              countryCode={currentLanguage.countryCode}
              className="mr-1"
              style={{ width: '1.25rem', height: '1.25rem' }}
              aria-label={currentLanguage.name}
            />
          )}
          <span className="text-sm font-medium">{currentLanguage?.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${language === lang.code ? 'bg-vanilla-beige/20' : ''}`}
          >
            <ReactCountryFlag
              svg
              countryCode={lang.countryCode}
              className="mr-2"
              style={{ width: '1.25rem', height: '1.25rem' }}
              aria-label={lang.name}
            />
            <span className="text-sm">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;