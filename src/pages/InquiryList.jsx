import { useEffect, useState } from "react";
import Table from "../components/Table";
import API from "../lib/utils";
import { format } from "date-fns";
import { Helmet } from "react-helmet-async";

const InquiryList = () => {
  const [inquiryDetails, setInquiryDetails] = useState([]);
  useEffect(() => {
    const fetchInquiryDetails = async () => {
      try {
        const response = await API.get("admin/enquiry");
        const data = response.data.map((item) => ({
          ...item,
          createdAt: format(new Date(item.createdAt), "dd-M-yy, hh:mm a"),
        }));
        setInquiryDetails(data);
        console.log(data); // Verify formatted data
      } catch (e) {
        console.log("Error In Fetching Inquiry Details");
      }
    };
    fetchInquiryDetails();
  }, []);
  

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Phone", accessor: "mobile" },
    { header: "E-mail", accessor: "email" },
    { header: "From", accessor: "checkInDate" },
    { header: "To", accessor: "checkOutDate" },
    { header: "Adults", accessor: "adults" },
    { header: "Children", accessor: "children" },
    { header: "No. of rooms", accessor: "rooms" },
    { header: "Created At", accessor: "createdAt",}
      
  ];

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Inquiry List</title>
        <meta name="Inquiry List" content="Eco Stay Inquiry List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Inquiry List</h1>
      {inquiryDetails.length > 0 ? (
        <Table columns={columns} data={inquiryDetails} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No records found</div>
      )}
    </div>
  );
};
export default InquiryList;
