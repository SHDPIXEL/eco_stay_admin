import Table from "../../components/Table";
import { useState, useEffect } from "react";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import API from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const RoomStatusList = () => {
  const navigate = useNavigate();
  const [roomStatus, setRoomStatus] = useState([]);

  useEffect(() => {
    const fetchRoomStatus = async () => {
      try {
        const response = await API.get(`/admin/getRoomStatus`);
        console.log("Room Status Data:", response.data);

        const formattedData = response.data.map((status) => ({
          ...status,
          status: {
            available: parseInt(status.status.available) || 0,
            booked: parseInt(status.status.booked) || 0,
          }, // ✅ Keep status as an object
        }));

        setRoomStatus(formattedData);
      } catch (error) {
        console.error("Error fetching room status:", error);
      }
    };

    fetchRoomStatus();
  }, []);

  const deleteRoomStatus = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this Room Status?"
      );
      if (!confirmDelete) return;

      const response = await API.delete(`/admin/deleteRoomStatus/${id}`);
      if (response.status === 200 || response.status === 201) {
        alert("Room status deleted successfully");
      }

      setRoomStatus((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error in deleting room status:", error);
      alert("Failed to delete room status");
    }
  };

  const columns = [
    { header: "Room Name", accessor: "Room.room_name" },
    { header: "Type", accessor: "Room.type" },
    { header: "Date", accessor: "date" },
    { header: "Available", accessor: "status.available" },
    { header: "Booked", accessor: "status.booked" },
  ];

  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />,
      handler: (row) =>
        navigate("/availability/add", {
          state: {
            availabilityData: row, // Pass the full row data
          },
        }),
      className: "text-green-500 hover:text-green-600",
    },
    {
      label: <Trash2 className="w-4 h-4" />,
      handler: (row) => deleteRoomStatus(row.id),
      className: "text-red-500 hover:text-red-600",
    },
  ];

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Room Status</title>
        <meta name="Room Status" content="Eco Stay Room Status List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Room Status</h1>
      {roomStatus.length > 0 ? (
        <Table columns={columns} data={roomStatus} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">
          No status records found
        </div>
      )}
    </div>
  );
};

export default RoomStatusList;
