"use client";
import { useEffect, useRef } from "react";

interface AddressInputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (address: {
    address: string;
    city: string;
    state: string;
    zip: string;
  }) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
  className?: string;
}

export default function AddressInputBox({
  value,
  onChange,
  onSelect,
  placeholder = "Enter address",
  required,
  name = "address",
  className = "input",
}: AddressInputBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        typeof window !== "undefined" &&
        window.google &&
        window.google.maps &&
        window.google.maps.places &&
        inputRef.current
      ) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["address"],
            componentRestrictions: { country: "us" },
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const components = place.address_components;
          if (!components) return;

          const get = (types: string[]) =>
            components.find((c) => types.every((t) => c.types.includes(t)))
              ?.long_name || "";

          const street = `${get(["street_number"])} ${get(["route"])}`.trim();
          const city = get(["locality"]);
          const state = get(["administrative_area_level_1"]);
          const zip = get(["postal_code"]);

          const full = `${street}, ${city}, ${state} ${zip}`;
          onChange(full);
          onSelect?.({ address: street, city, state, zip });
        });

        clearInterval(interval);
      }
    }, 200); // check every 200ms

    return () => clearInterval(interval);
  }, [onChange, onSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      name={name}
      required={required}
      className={className}
      placeholder={placeholder}
      value={value}
      autoComplete="off"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
