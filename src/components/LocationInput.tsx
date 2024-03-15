import React, { forwardRef, useState, useMemo } from "react";
import { Input } from "./ui/input";
import citiesList from "@/lib/cities-list";

interface LocationInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onLocationSelected: (location: string) => void;
}

export default forwardRef<HTMLInputElement, LocationInputProps>(
  function LocationInput({ onLocationSelected, ...props }, ref) {
    const [locationSearchInput, setLocationSearchInput] = useState("");
    const [hasFocus, setHasFocus] = useState(false);

    const cities = useMemo(() => {
      if (!locationSearchInput.trim()) return [];

      const searchWords = locationSearchInput.split(" ");
      
      return citiesList
        .map((city) => `${city.name}, ${city.subcountry}, ${city.country}`)
        .filter(
          (city) =>
            city.toLowerCase().startsWith(searchWords[0].toLowerCase()) &&
            searchWords.every((word) =>
              city.toLowerCase().includes(word.toLowerCase()),
            ),
        )
        .slice(0, 5);
    }, [locationSearchInput]);

    return (
      <div className="relative">
        <Input
          placeholder="Search for a city"
          type="search"
          onChange={(e) => setLocationSearchInput(e.target.value)}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          {...props}
          ref={ref}
        />
        {locationSearchInput.trim() && hasFocus && (
          <div className="absolute z-20 w-full rounded-b-lg border-x border-b bg-background shadow-xl">
            {!cities.length && <p className="p-3">No results found</p>}
            {cities.map((city) => (
              <button onMouseDown={(e) => {
                e.preventDefault()
                onLocationSelected(city)
                setLocationSearchInput('')
              }} className="block w-full border p-2 text-start" key={city}>
                {city}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
