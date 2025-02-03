import { useNavigate } from "react-router";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../lib/utils";
import { Helmet } from "react-helmet-async";

const ListPackage = () => {
  const navigate = useNavigate();
  const [packageDetails, setPackageDetails] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/package");
        const parseResponse = response.data;
        setPackageDetails(parseResponse);
        console.log(parseResponse);
      } catch (e) {
        console.error("Some error occurred:", e);
      }
    };
    fetchData();
  }, []);

  const deletePackage = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete the package ?");
      if (!confirmDelete) return;

      const response = await API.delete(`/admin/package/${id}`);
      if (response.status === 201) {
        alert("Record deleted successfully");
      }

      setPackageDetails((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (e) {
      console.error("Error in deleteing the package record", e);
      alert("failed to delete the record")
    }
  };

  const updateStatus = async (row) => {
    try {
      const confirmChangeStatus = window.confirm("Are you sure you want to change the status ?");
      if (!confirmChangeStatus) return;

      const newStatus = row.status === "Active" ? "Inactive" : "Active"

      const response = await API.put(`/admin/package/${row.id}`, {
        status: newStatus,
      });
      if (response.status === 201 || 200) {
        alert("Status changed successfully");
      }

      setPackageDetails((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, status: newStatus } : item
        )
      );
    } catch (e) {
      console.error("Error in changing the status", e);
      alert("failed to change status")
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Package Price(INR)", accessor: "package_price" },
    { header: "Key Elements", accessor: "long_description" },
    { header: "Description", accessor: "short_description" },
    { header: "Status", accessor: "status" },
  ];


  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />,
      handler: (row) => navigate("/packages/add", { state: { packageData: row } }),
      className: "text-green-500 hover:text-green-600",
    },
    {
      label: <Trash2 className="w-4 h-4" />,
      handler: (row) => deletePackage(row.id),
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
        <title>Eco Stay | Package List</title>
        <meta name="Package List" content="Eco Stay Package List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Package List</h1>
      {
        packageDetails.length > 0 ? (
          <Table columns={columns} data={packageDetails} globalActions={actions} />
        ) : (
          <div className="text-center text-gray-600 mt-10">No records found</div>
        )
      }
    </div>
  );
};

export default ListPackage;
