"use client";

import { useState } from "react";
import AddressInputBox from "components/AddressInputBox";
import { stateAbbreviations } from "app/utils/states";

export default function NewDealerForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    contactName: "",
    lienholderId: "",
    selectedState: "",
    creditsRemaining: 0,
  });

  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "zip" && !/^\d*$/.test(value)) return;
    if (name === "creditsRemaining" && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, ""); // remove all non-digits

    if (digits.length === 10) {
      const formatted = `(${digits.slice(0, 3)}) ${digits.slice(
        3,
        6
      )}-${digits.slice(6)}`;
      e.target.value = formatted;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const form = e.currentTarget as HTMLFormElement;

    const phoneInput = form.elements.namedItem("phone") as HTMLInputElement;
    phoneInput.setCustomValidity("");
    if (!phoneRegex.test(phoneInput.value.trim())) {
      phoneInput.setCustomValidity("Phone must be in format (xxx) xxx-xxxx");
      phoneInput.reportValidity();
      return;
    }

    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    emailInput.setCustomValidity("");
    if (!emailRegex.test(formData.email)) {
      const emailInput = form.elements.namedItem("email") as HTMLInputElement;
      emailInput.setCustomValidity("Invalid email address");
      emailInput.reportValidity();
      return;
    }

    // Submit formData here
    console.log("Submitting:", formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold mb-4">New Dealer Entry</h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={handleSubmit}
      >
        <input
          name="name"
          placeholder="Dealer Name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="contactName"
          placeholder="Contact Name"
          value={formData.contactName}
          onChange={handleChange}
          className="input"
        />
        <AddressInputBox
          value={formData.address}
          onChange={(val) => setFormData((prev) => ({ ...prev, address: val }))}
          onSelect={({ address, city, state, zip }) =>
            setFormData((prev) => ({
              ...prev,
              address,
              city,
              state: stateAbbreviations[state] || state,
              zip,
            }))
          }
        />
        <input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="input"
          required
        />
        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          name="zip"
          placeholder="Zip Code"
          value={formData.zip}
          onChange={handleChange}
          className="input"
          maxLength={5}
          required
        />
        <input
          name="phone"
          placeholder="Phone (xxx) xxx-xxxx"
          value={formData.phone}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="lienholderId"
          placeholder="Lienholder ID"
          value={formData.lienholderId}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="creditsRemaining"
          placeholder="Credits Remaining"
          value={formData.creditsRemaining}
          onChange={handleChange}
          className="input"
        />
        <div className="md:col-span-2 text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
          >
            Submit Dealer
          </button>
        </div>
      </form>
    </div>
  );
}
