import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import API from "../../lib/utils";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

const ListType = () => {
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/room");
        const parseResponse = response.data;

        const formattedResponse = parseResponse.map((room) => ({
          ...room,
          room_images: JSON.parse(room.room_images),
          package_ids: JSON.parse(room.package_ids),
          amenities_show: JSON.parse(room.amenities).join(", "),
          status_show: `available: ${
            JSON.parse(room.status).available
          }, booked: ${JSON.parse(room.status).booked}`, // Format the status as a string
        }));

        setRoomDetails(formattedResponse);
      } catch (e) {
        console.error("Error fetching room details:", e);
      }
    };
    fetchData();
  }, []);

  const deleteRoom = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete Room ?"
      );
      if (!confirmDelete) return;

      const response = await API.delete(`/admin/room/${id}`);
      if (response.status === 200 || 201) {
        alert("Record deleted successfully");
      }
      setRoomDetails((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      console.error("Error in deleting the room");
      alert("Failed to delete room");
    }
  };

  const columns = [
    { header: "Image", accessor: "room_images" },
    { header: "Title", accessor: "room_name" },
    // { header: "Capacity", accessor: "capacity" },
    { header: "Old single occupancy price(INR)", accessor: "single_base_price" },
    { header: "Offer single occupancy price(INR)", accessor: "single_new_price" },
    { header: "Old Double occupancy price(INR)", accessor: "double_base_price" },
    { header: "Offer Double occupancy price(INR)", accessor: "double_new_price" },
    { header: "Tags", accessor: "amenities_show" },
    { header: "Rooms status", accessor: "status_show" },
  ];

  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />,
      handler: (row) => navigate("/roomtype/add", { state: { roomData: row } }),
      className: "text-green-500 hover:text-green-600",
    },
    {
      label: <Trash2 className="w-4 h-4" />,
      handler: (row) => deleteRoom(row.id),
      className: "text-red-500 hover:text-red-600",
    },
    // {
    //   label: <RefreshCcw className="w-4 h-4"/>,
    //   handler: (row) => alert(`Confirm Change Status`),
    //   className: "text-blue-500 hover:text-blue-600",
    // },
  ];

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Room List</title>
        <meta name="Room List" content="Eco Stay Room List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Room List</h1>
      {roomDetails.length > 0 ? (
        <Table columns={columns} data={roomDetails} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No records found</div>
      )}
    </div>
  );
};

export default ListType;
