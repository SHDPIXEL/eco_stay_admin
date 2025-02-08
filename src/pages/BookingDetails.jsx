import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import API from "../lib/utils";
import { format } from "date-fns";
import { Helmet } from "react-helmet-async";


// Helper function to format the date with the correct suffix
const formatDateWithSuffix = (dateString) => {
  if (!dateString || dateString === "00-00-0000") return dateString; // Return as is if invalid

  const date = new Date(dateString);
  if (isNaN(date)) return dateString; // In case of an invalid date

  const day = format(date, "d"); // Extract the day
  const month = format(date, "MMM"); // Extract the abbreviated month
  const year = format(date, "yyyy"); // Extract the year

  // Determine the suffix for the day
  const suffix = ["st", "nd", "rd"][(day % 10) - 1] || "th";

  return `${day}${suffix} ${month} ${year}`;
};

const BookingDetails = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/booking-details");
        const data = response.data.map((item) => ({
          ...item,
          checkInDate: formatDateWithSuffix(item.checkInDate),
          checkOutDate: item.checkOutDate === "00-00-0000" ? item.checkOutDate : formatDateWithSuffix(item.checkOutDate),
          createdAt: format(new Date(item.createdAt), "dd-M-yy, hh:mm a"),
        }));
        setDetails(data);
      } catch (e) {
        console.error("Some error occurred:", e);
        setError("Failed to fetch booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  

  const columns = [
    { header: "User Id", accessor: "user_Id" },
    {
      header: "Booked By",
      accessor: "BookedBy",
    },
    { header: "Room Type", accessor: "roomType" },
    { header: "Customer Name", accessor: "customerName" },
    { header: "Customer Phone", accessor: "customerPhone" },
    { header: "Check-In", accessor: "checkInDate" },
    { header: "Check-out", accessor: "checkOutDate" },
    { header: "No. of Cottages", accessor: "number_of_cottages" },
    { header: "Selected Packages", accessor: "selected_packages" },
    { header: "Selected Occupancy", accessor: "selected_occupancy" },
    {
      header: "Status",
      accessor: "status",
      Cell: ({ value }) => (
        <span
          className={`px-2 py-1 font-semibold ${
            value?.toLowerCase() === "pending"
              ? "text-red-500"
              : value?.toLowerCase() === "confirmed"
              ? "text-green-500"
              : "text-gray-500"
          }`}
        >
          {value}
        </span>
      ),
    },
    { header: "Amount(INR)", accessor: "amount" },
    {
      header: "Payment Status",
      accessor: "paymentStatus",
      Cell: ({ value }) => (
        <span
          className={`px-2 py-1 font-semibold ${
            value?.toLowerCase() === "pending"
              ? "text-red-500"
              : value?.toLowerCase() === "paid"
              ? "text-green-500"
              : "text-gray-500"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Booking Details</title>
        <meta name="Booking Details" content="Eco Stay Booking Details!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Booking Details</h1>
      {details.length > 0 ? (
        <Table columns={columns} data={details} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No records found</div>
      )}
    </div>
  );
};

export default BookingDetails;
