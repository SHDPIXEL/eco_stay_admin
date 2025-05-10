import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import API from "../../lib/utils";
import { Helmet } from "react-helmet-async";

const ListAgent = () => {
  const navigate = useNavigate();
  const [agentDetails, setAgentDetails] = useState([]);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await API.get("/admin/agent");
        console.log("data",response.data)
        const Data = response.data;

        // Log the raw data for debugging
        // console.log("Raw agent data:", Data);

        // Handle the idProof field safely
        const parsedData = Data.map(agent => ({
          ...agent,
          idProof: handleIdProof(agent.idProof),
        }));

        setAgentDetails(parsedData);
        // console.log("Parsed agent data:", parsedData);
      } catch (e) {
        console.log("Error getting the agents", e);
      }
    };

    fetchAgent();
  }, []);

  // Utility function to check if a string is valid JSON
  const isValidJson = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Function to handle the `idProof` field
  const handleIdProof = (idProof) => {
    // If `idProof` is already an object, return it as is
    if (typeof idProof === "object" && idProof !== null) {
      return idProof;
    }
    
    // If `idProof` is a string that can be parsed as JSON, parse it
    if (isValidJson(idProof)) {
      return JSON.parse(idProof);
    }

    // Otherwise, return an empty string or any default value
    return idProof || "";
  };

  const deleteAgent = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete the Agent?");
      if (!confirmDelete) return;
  
      const response = await API.delete(`/admin/agent/${id}`);
  
      // ✅ Check if the response has JSON data
      let responseData;
      try {
        responseData = response.data; // Axios automatically parses JSON, no need for response.json()
      } catch (error) {
        console.warn("Response is not in JSON format");
        responseData = null;
      }
  
      // ✅ Ensure correct status checking (Fixes issue with `if (response.status === 200 || 201)`)
      if (response.status === 200 || response.status === 201) {
        alert("Agent Deleted Successfully");
  
        // ✅ Update state only if deletion is successful
        setAgentDetails((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(responseData?.message || "Failed to delete the Agent");
      }
    } catch (e) {
      console.error("Error in deleting the agent record", e);
  
      // ✅ Check if error response is JSON or plain text
      const errorMessage =
        e.response?.data?.message ||
        e.response?.data ||
        "Unexpected error occurred while deleting the agent.";
  
      alert(errorMessage);
    }
  };
  

  const updateStatus = async (row) => {
    try {
      const confirmChangeStatus = window.confirm("Are you sure you want to change the status ?");
      if (!confirmChangeStatus) return;

      const newStatus = row.status === "Active" ? "Inactive" : "Active";

      const response = await API.put(`/admin/agent/${row.id}`, {
        status: newStatus,
      });
      if (response.status === 201 || 200) {
        alert("Status changed successfully");
      }

      setAgentDetails((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, status: newStatus } : item
        )
      );
    } catch (e) {
      console.error("Error in changing the status", e);
      alert("Failed to change status");
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "E-mail", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Address", accessor: "address" },
    { header: "City", accessor: "city" },
    { header: "State", accessor: "state" },
    { header: "Pincode", accessor: "pincode" },
    { header: "Country", accessor: "country" },
    { header: "Id-proof", accessor: "idProof" },
    { header: "Status", accessor: "status" },
    { header: "Offers", accessor: "offers" },
  ];

  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />,
      handler: (row) => navigate("/agent/add", { state: { agentData: row } }),
      className: "text-green-500 hover:text-green-600",
    },
    {
      label: <Trash2 className="w-4 h-4" />,
      handler: (row) => deleteAgent(row.id),
      className: "text-red-500 hover:text-red-600",
    },
    {
      label: <RefreshCcw className="w-4 h-4" />,
      handler: (row) => updateStatus(row),
      className: "text-blue-500 hover:text-blue-600",
    },
  ];

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Agent List</title>
        <meta name="Agent List" content="Eco Stay Agent List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Agent List</h1>
      {agentDetails.length > 0 ? (
        <Table columns={columns} data={agentDetails} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No records found</div>
      )}
    </div>
  );
};

export default ListAgent;
