import React, { useEffect, useState } from "react";
import { Calendar, Hash, Package } from "lucide-react";
import API from "../../lib/utils";
import { useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";

const AddAvailability = () => {
  const location = useLocation();
  const availabilityData = location.state?.availabilityData;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    room_id: "",
    date: "",
    status: { available: null, booked: null }, // Use null instead of 0
  });

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authorization token is missing");
        }

        const response = await API.get("/admin/room", {
          headers: {
            Authorization: token,
          },
        });

        const roomsData = response.data.map((room) => ({
          id: room.id,
          room_name: room.room_name,
        }));

        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (availabilityData) {
      console.log("Existing availability data:", availabilityData);

      let parsedStatus = { available: null, booked: null }; // Default to null

      if (typeof availabilityData.status === "string") {
        const matches = availabilityData.status.match(/\d+/g); // Extract numbers
        if (matches && matches.length === 2) {
          parsedStatus = {
            available: parseInt(matches[0]),
            booked: parseInt(matches[1]),
          };
        }
      } else if (typeof availabilityData.status === "object") {
        parsedStatus = {
          available: availabilityData.status.available ?? null,
          booked: availabilityData.status.booked ?? null,
        };
      }

      setFormData({
        room_id: availabilityData.room_id || "",
        date: availabilityData.date || "",
        status: parsedStatus, // ✅ Correctly parsed status
      });
    }
  }, [availabilityData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCottageChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      status: {
        ...prev.status,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authorization token is missing");

      // Validate required fields
      if (!formData.room_id || !formData.status || !formData.date) {
        alert("Please fill in all required fields (room, status, and date).");
        return;
      }

      // Convert and structure data
      const availabilityData = {
        room_id: formData.room_id,
        status: JSON.stringify({
          available: formData.status.available,
          booked: formData.status.booked,
        }),
        date: formData.date,
      };

      const formDataToSend = new FormData();
      formDataToSend.append(
        "availability_data",
        JSON.stringify(availabilityData)
      );

      let response;
      if (formData.availability_id) {
        // If availability_id exists, perform an update (PUT)
        response = await API.put(
          `/admin/updateRoomStatus/${formData.availability_id}`,
          formDataToSend,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Otherwise, create a new entry (POST)
        response = await API.post("/admin/createRoomStatus", formDataToSend, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        console.log("Room availability saved successfully", response.data);
        alert("Room availability saved successfully!");
        navigate("/availability/list");
      }
    } catch (error) {
      console.error("Error handling room availability:", error);
      alert(
        error.response?.data?.message ||
          "Error processing room availability. Please try again."
      );
    }
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Add Room Availability</title>
        <meta
          name="Room Availability Add"
          content="Eco Stay Room Availability Add!"
        />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Add Room Availability
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Date */}
        <div className="flex flex-col">
          <label
            htmlFor="date"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Calendar className="h-4 w-4 text-gray-400" />
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            required
          />
        </div>

        {/* Room ID */}
        <div className="flex flex-col">
          <label
            htmlFor="room_id"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Hash className="h-4 w-4 text-gray-400" />
            Room
          </label>
          <select
            name="room_id"
            id="room_id"
            className="p-3 rounded-lg border border-gray-300"
            value={formData.room_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.room_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            Cottages Status
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="available" className="text-sm text-gray-600">
                Available
              </label>
              <input
                type="number"
                name="available"
                value={formData.status?.available ?? ""} // Prevent 0 from showing
                className="w-full p-3 rounded-lg border border-gray-300"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: {
                      ...formData.status,
                      available: e.target.value
                        ? parseInt(e.target.value, 10)
                        : null,
                    },
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="booked" className="text-sm text-gray-600">
                Booked
              </label>
              <input
                type="number"
                name="booked"
                value={formData.status?.booked ?? ""} // Prevent 0 from showing
                className="w-full p-3 rounded-lg border border-gray-300"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: {
                      ...formData.status,
                      booked: e.target.value
                        ? parseInt(e.target.value, 10)
                        : null,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
          >
            Add Availability
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAvailability;
