"use client";

import React, { useState, useEffect } from "react";
import { countries, getCitiesByCountryCode } from "./countryData";

interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

interface AddressFormProps {
  address?: Address;
  onSubmit: (address: Address) => void;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
  showSetDefault?: boolean;
}

export default function AddressForm({
  address,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
  showSetDefault = true,
}: AddressFormProps) {
  const [formData, setFormData] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false,
    ...address,
  });

  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update cities when country changes
  useEffect(() => {
    if (formData.country) {
      const cities = getCitiesByCountryCode(formData.country);
      setAvailableCities(cities);

      // Reset city if it's not in the new country's cities
      if (formData.city && !cities.includes(formData.city)) {
        setFormData((prev) => ({ ...prev, city: "" }));
      }
    } else {
      setAvailableCities([]);
    }
  }, [formData.country]);

  // Initialize cities if address already has a country
  useEffect(() => {
    if (address?.country) {
      const cities = getCitiesByCountryCode(address.country);
      setAvailableCities(cities);
    }
  }, [address]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State/Province is required";
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP/Postal code is required";
    }
    if (!formData.country) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Street Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Street Address *
        </label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color ${
            errors.street ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your street address"
        />
        {errors.street && (
          <p className="text-red-500 text-sm mt-1">{errors.street}</p>
        )}
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country *
        </label>
        <select
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color ${
            errors.country ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.country && (
          <p className="text-red-500 text-sm mt-1">{errors.country}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City *
        </label>
        {availableCities.length > 0 ? (
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color ${
              errors.city ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select City</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color ${
              errors.city ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={
              formData.country ? "Select a country first" : "Enter city name"
            }
            disabled={!formData.country}
          />
        )}
        {errors.city && (
          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
        )}
      </div>

      {/* State/Province */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State/Province *
        </label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color ${
            errors.state ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter state or province"
        />
        {errors.state && (
          <p className="text-red-500 text-sm mt-1">{errors.state}</p>
        )}
      </div>

      {/* ZIP Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ZIP/Postal Code *
        </label>
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color ${
            errors.zipCode ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter ZIP or postal code"
        />
        {errors.zipCode && (
          <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
        )}
      </div>

      {/* Set as Default - Only show for new addresses or when there are multiple addresses */}
      {!isEdit && showSetDefault && (
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              className="mr-2 h-4 w-4 text-theme-color focus:ring-theme-color border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">
              Set as default address
            </span>
          </label>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-theme-color text-white rounded-md hover:bg-theme-color/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                ></circle>
                <path
                  fill="currentColor"
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isEdit ? "Updating..." : "Adding..."}
            </span>
          ) : isEdit ? (
            "Update Address"
          ) : (
            "Add Address"
          )}
        </button>
      </div>
    </form>
  );
}
