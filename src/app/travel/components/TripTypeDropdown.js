import { useState, useEffect } from "react";
// uses example
//  <TripTypeDropdown tripType={tripType} onTripTypeChange={handleTripTypeChange} />
const TRIP_TYPE = "tripType";
const CUSTOM_TRIP_TYPE = "customTripType";

const TripTypeDropdown = ({ tripType, onFieldChange }) => {
  const [customTripType, setCustomTripType] = useState("");

  const handleTripTypeChange = (event) => {
    const value = event.target.value;
    onFieldChange(TRIP_TYPE, value); // Notify parent
    if (value !== "other") {
      //onFieldChange(CUSTOM_TRIP_TYPE, ""); // Reset custom field if not "Other"
      setCustomTripType("");
    }
  };
  //   const handleCustomTripTypeChange = (event) => {
  //     const value = event.target.value;
  //     if (value == "other") {
  //       onFieldChange(CUSTOM_TRIP_TYPE, value); // Reset custom field if not "Other"
  //       setCustomTripType(value);
  //     }
  //   };
  useEffect(() => {
    // Update the parent with the custom value if "Other" is selected
    // if (tripType === "other") {
    //  // onFieldChange(CUSTOM_TRIP_TYPE, customTripType);
    // }
  }, [tripType, onFieldChange]);

  return (
    <div className=" mb-4 inline-block space-y-2">
      <div>
        <label
          htmlFor="tripType"
          className="block text-sm font-medium text-gray-700"
        >
          Trip Type
        </label>
        <select
          id="tripType"
          value={tripType}
          onChange={handleTripTypeChange}
          className="mb-3 px-3 py-2 block border focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 sm:text-sm rounded-md shadow-sm focus:outline-none"
        >
          <option value="">Select Trip Type</option>
          <option value="honeymoon">Honeymoon</option>
          <option value="solo adventure">Solo Adventure</option>
          <option value="family vacation">Family Vacation</option>
          <option value="business trip">Business Trip</option>
          <option value="other">Other</option>
        </select>
      </div>

      {tripType === "other" && (
        <div>
          <label
            htmlFor="customTripType"
            className="block text-sm font-medium text-gray-700"
          >
            Please specify
          </label>
          <input
            id="customTripType"
            type="text"
            value={customTripType}
            onChange={(e) => setCustomTripType(e.target.value)}
            className="mt-1 block  px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter your trip type"
          />
        </div>
      )}
    </div>
  );
};

export default TripTypeDropdown;
