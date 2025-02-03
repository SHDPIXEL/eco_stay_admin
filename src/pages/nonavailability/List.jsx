import Table from "../../components/Table";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../lib/utils";
import { Helmet } from "react-helmet-async";

const List = () => {
  const [nonAvailability, setNonAvailability] = useState([]);

  useEffect(() => {
    const fetchNonAvailability = async () => {
      try {
        const response = await API.get("/admin/availability");
        const data = response.data;

        const enrichedData = await Promise.all(
          data.map(async (item) => {
            const roomResponse = await API.get(`/admin/room/${item.room_id}`);
            const roomName = roomResponse.data.room_name;
            return { ...item, room_name: roomName };
          })
        );
        setNonAvailability(enrichedData);
        console.log(enrichedData);
      } catch (e) {
        console.error("Error in fetching Non-Availability data", e);
      }
    };
    fetchNonAvailability();
  }, []);

  // Delete a specific record
  const deleteNonAvailability = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this record?");
      if (!confirmDelete) return;

      const response = await API.delete(`/admin/availability/${id}`);
      if (response.status === 201) {
        alert("Record deleted successfully");
        console.log("Filtering non-availability records...");
        setNonAvailability((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (e) {
      console.error("Error in deleting Non-Availability record", e);
      alert("Failed to delete the record");
    }
  };

  // Table columns
  const columns = [
    { header: "Date", accessor: "date" },
    { header: "Room ID", accessor: "room_id" },
    { header: "Room Name", accessor: "room_name" },
    { header: "Count", accessor: "count" },
  ];

  // Table actions
  const actions = [
    {
      label: <Trash2 className="w-4 h-4" />,
      handler: (row) => deleteNonAvailability(row.id),
      className: "text-red-500 hover:text-red-600",
    },
  ];

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | List Non-Availability</title>
        <meta name="List Non-Availability" content="Eco Stay Non Availability List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Non Availability</h1>
      {nonAvailability.length > 0 ? (
        <Table columns={columns} data={nonAvailability} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No records found</div>
      )}
    </div>
  );
};

export default List;
