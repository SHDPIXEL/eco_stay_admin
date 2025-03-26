import React from "react";
import { BASE_URL } from "../lib/utils"; // Import BASE_URL

const validAccessors = ["images", "room_images", "idProof"]; // Add "room_images" to the valid accessors
// console.log('BASE_URL',BASE_URL);
// Table Component
const Table = ({ columns, data, globalActions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200 bg-white shadow-md rounded-lg md:text-sm text-xs">
        {/* Table Header */}
        <thead>
          <tr className="bg-gray-100 text-left text-gray-600 font-semibold uppercase tracking-wider">
            {columns.map((column, index) => (
              <th key={index} className="px-6 py-3 border-b border-gray-200">
                {column.header}
              </th>
            ))}
            {globalActions && (
              <th className="px-6 py-3 border-b border-gray-200">Actions</th>
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {[...data].reverse().map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-gray-50 ${
                rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 border-b border-gray-200 text-gray-700"
                >
                  {renderCellContent(column, row)}
                </td>
              ))}

              {globalActions && (
                <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                  <div className="flex gap-2">
                    {globalActions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={() => action.handler(row)}
                        className={`px-3 py-1 text-sm rounded-md ${action.className}`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper function to render cell content with text color changes
const renderCellContent = (column, row) => {
  const value = row[column.accessor];

  // Debugging: Log the value of idProof to ensure it's being passed correctly
  if (column.accessor === "idProof") {
    // console.log("Value of idProof column:", value);
  }

  if (column.accessor === "Room.room_name") {
    return <span>{row.Room?.room_name || "N/A"}</span>;
  }

  if (column.accessor === "Room.type") {
    return <span>{row.Room?.type || "N/A"}</span>;
  }

  if (column.accessor === "date") {
    try {
      const formattedDate = new Date(row.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return <span>{formattedDate || "N/A"}</span>;
    } catch (error) {
      console.error("Error formatting date:", error, row.date);
      return <span>N/A</span>;
    }
  }

  if (column.accessor === "status.available") {
    try {
      let status = row.status;
      console.log("Raw status:", status); // Debugging log

      // If status is an object, return the value directly
      if (typeof status === "object") {
        return status?.available ?? "N/A";
      }

      // If status is a string but not JSON, use regex
      if (typeof status === "string" && !status.startsWith("{")) {
        const availableMatch = status.match(/Available:\s*(\d+)/i);
        return availableMatch ? availableMatch[1] : "N/A";
      }

      // Otherwise, parse JSON string
      status = JSON.parse(status);
      return status?.available ?? "N/A";
    } catch (error) {
      console.error("Error parsing status:", error, row.status);
      return "N/A";
    }
  }

  if (column.accessor === "status.booked") {
    try {
      let status = row.status;
      console.log("Raw status:", status); // Debugging log

      if (typeof status === "object") {
        return status?.booked ?? "N/A";
      }

      if (typeof status === "string" && !status.startsWith("{")) {
        const bookedMatch = status.match(/Booked:\s*(\d+)/i);
        return bookedMatch ? bookedMatch[1] : "N/A";
      }

      status = JSON.parse(status);
      return status?.booked ?? "N/A";
    } catch (error) {
      console.error("Error parsing status:", error, row.status);
      return "N/A";
    }
  }

  // Handle 'BookedBy' column logic for user_Id and agentId
  if (column.accessor === "BookedBy") {
    const { user_Id, agentId } = row;

    if (user_Id) {
      return <span className="font-medium text-gray-700">User</span>;
    }
    if (agentId) {
      return <span className="font-medium text-gray-700">Agent</span>;
    }
    return <span className="font-medium text-gray-700">Unknown</span>;
  }

  // Handle status column (text color instead of background color)
  if (column.accessor === "status") {
    return (
      <span
        className={`font-medium ${
          value.toLowerCase() === "pending"
            ? "text-red-500"
            : value.toLowerCase() === "confirmed" ||
              value?.toLowerCase() === "success"
            ? "text-green-500"
            : "text-gray-500"
        }`}
      >
        {value}
      </span>
    );
  }

  // Handle payment status column (text color)
  if (column.accessor === "paymentStatus") {
    return (
      <span
        className={`font-medium ${
          value.toLowerCase() === "pending"
            ? "text-red-500"
            : value.toLowerCase() === "paid"
            ? "text-green-500"
            : "text-gray-500"
        }`}
      >
        {value}
      </span>
    );
  }

  // Handle images (for room_images column)
  if (column.accessor === "room_images" && value) {
    console.log("room_images value:", value);

    if (Array.isArray(value) && value.length > 0) {
      return (
        <div className="grid grid-cols-2 gap-2 w-40">
          {value.map((image, index) => {
            const imageUrl = `${BASE_URL}/assets/images/${image}`;
            console.log("Generated room image URL:", imageUrl); // Debugging log
            return (
              <img
                key={index}
                src={imageUrl}
                alt={`Room Image ${index + 1}`}
                className="w-16 h-16 object-cover rounded-md border border-gray-200 hover:scale-105"
              />
            );
          })}
        </div>
      );
    }
    return null;
  }

  // Handle images (for idProof column)
  if (column.accessor === "idProof" && value) {
    // console.log("idProof value:", value);
    const imageUrl = `${BASE_URL}/assets/images/${value}`;
    return (
      <img
        key="1"
        src={imageUrl}
        alt={`IdProof Image`}
        className="w-12 h-12 object-cover rounded-md border border-gray-200 hover:scale-105"
      />
    );
  }

  // Handle descriptions
  if (column.accessor === "description") {
    return (
      <p className="text-gray-600 text-sm truncate max-w-xs" title={value}>
        {value}
      </p>
    );
  }

  // Default rendering for other columns
  return typeof value === "function" ? value(row) : value;
};

export default Table;
