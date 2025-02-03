import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import API from "../lib/utils";
import { Helmet } from "react-helmet-async";

const BookingDetails = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/booking-details");
        const parseResponse = response.data;
        setDetails(parseResponse);
        console.log(parseResponse);
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
    { header: "user Id", accessor: "user_Id" },
    { header: "Room Type", accessor: "roomType" },
    { header: "Customer Name", accessor: "customerName" },
    { header: "Customer Phone", accessor: "customerPhone" },
    { header: "Check-In", accessor: "checkInDate" },
    { header: "Check-out", accessor: "checkOutDate" },
    { header: "No. of Cottages", accessor: "number_of_cottages" },
    { header: "Selected Packages", accessor: "selected_packages" },
    { header: "Selected Occupancy", accessor: "selected_occupancy" },
    { header: "Status", accessor: "status" },
    { header: "Amount(INR)", accessor: "amount" },
    { header: "Payment Status", accessor: "paymentStatus" },
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
