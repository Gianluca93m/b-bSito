"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";

const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

export default function CalendarWidget() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  return (
    <div>
      <Calendar
        selectRange
        onChange={(value) => {
          if (Array.isArray(value) && value.length === 2) {
            setDateRange([
              value[0] instanceof Date ? value[0] : null,
              value[1] instanceof Date ? value[1] : null,
            ]);
          }
        }}
        value={dateRange}
        className="mb-2"
      />
      {dateRange[0] && dateRange[1] && (
        <div className="text-sm text-gray-700">
          Check-in: {dateRange[0] ? dateRange[0].toLocaleDateString() : ""}<br />
          Check-out: {dateRange[1] ? dateRange[1].toLocaleDateString() : ""}
        </div>
      )}
    </div>
  );
}