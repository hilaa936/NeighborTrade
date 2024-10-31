import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { getDateDifference } from "@/utils/formatDate";

export default function DateDifference() {
  const [startDate, setStartDate] = useState("2024-10-12");
  const [endDate, setEndDate] = useState("2024-11-14");
  const [difference, setDifference] = useState("");

  useEffect(() => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const timeString = getDateDifference(start, end);
    setDifference(timeString);
  }, [startDate, endDate]);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Date Difference Calculator
      </h2>
      <div className="flex flex-col space-y-2">
        <label htmlFor="startDate" className="text-gray-700 font-semibold">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="endDate" className="text-gray-700 font-semibold">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800"
        />
      </div>
      <div className="mt-4 text-center text-xl font-semibold text-green-600">
        {difference ? `Time between: ${difference}` : "Please select dates"}
      </div>
    </div>
  );
}
