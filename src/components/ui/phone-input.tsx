import { forwardRef } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './phone-input.css';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultCountry?: string;
  countries?: string[];
}

export const InternationalPhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, placeholder, disabled, className, defaultCountry = 'MU', countries, ...props }, ref) => {
    return (
      <div className={cn("relative", className)}>
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          defaultCountry={defaultCountry as any}
          countries={countries as any}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "phone-input-container",
            "flex h-10 w-full rounded-md border border-input bg-background text-base ring-offset-background",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

InternationalPhoneInput.displayName = "InternationalPhoneInput";