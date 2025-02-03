import Table from "../components/Table";
import API from "../lib/utils";
import { useState,useEffect } from "react";
import { Helmet } from "react-helmet-async";

const PaymentList = () => {

  const [paymentDetails, SetpaymentDetails] = useState([]);

  useEffect(() =>{
    const fetchpaymentInfo = async () => {
      try{
        const response = await API.get("/admin/payment");
        const data = response.data;
        SetpaymentDetails(data);

      }catch(e){
        console.log("Error in fetching Payment Info", e)
      }
    }
    fetchpaymentInfo();
  },[])


  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Book ID", accessor: "payid" },
    { header: "Transaction Id", accessor: "transactionid" },
    { header: "Method", accessor: "method" },
    { header: "Status", accessor: "status" },
    { header: "Time-stamp", accessor: "timestamp" },
  ];

  // const data = [
  //   {
  //     id: 1,
  //     payid: "f7d9f87d89f",
  //     transactionid: "j4343kj43j43kj",
  //     method: "UPI",
  //     status: "True",
  //     timestamp: "12:00:00",
  //   },
  //   {
  //     id: 2,
  //     payid: "a8d7f67gh6g",
  //     transactionid: "b8743jk43j43j",
  //     method: "Card",
  //     status: "False",
  //     timestamp: "13:30:00",
  //   },
  //   {
  //     id: 3,
  //     payid: "b2c7f87h89d",
  //     transactionid: "h8234lkj2lk4l",
  //     method: "Netbanking",
  //     status: "True",
  //     timestamp: "15:45:00",
  //   },
  //   {
  //     id: 4,
  //     payid: "k7j9d87g98d",
  //     transactionid: "g4372klj12lkj",
  //     method: "UPI",
  //     status: "Pending",
  //     timestamp: "16:20:00",
  //   },
  // ];

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Payment List</title>
        <meta name="Payment List" content="Eco Stay Payment List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Payment List</h1>
      {
        paymentDetails.length > 0 ? (
          <Table columns={columns} data={paymentDetails} />
        ) : (
          <div className="text-center text-gray-600 mt-10">No records found</div>
        )
      }
    </div>
  );
};

export default PaymentList;
