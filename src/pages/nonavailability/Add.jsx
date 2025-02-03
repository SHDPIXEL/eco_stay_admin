import React, { useEffect, useState } from "react";
import { Calendar, Hash } from "lucide-react";
import API from "../../lib/utils";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";

const AddRoom = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    room_id: "",
    count: "",
  });

  const [rooms, setRoom] = useState([]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authorization token is missing");
        }

        const response = await API.get("/admin/room", {
          headers: {
            Authorization: token,
          }
        });

        const rooms = response.data;
        const formattedRoom = rooms.map((room) => ({
          id: room.id,
          room_name: room.room_name
        }))
        setRoom(formattedRoom);
        console.log(formattedRoom)
        console.log("Roomes fetched Successfully", formattedRoom)
      } catch (e) {
        console.error("Error in fetching rooms", e)
      }
    }
    fetchRoom();
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Room Form Submitted", formData);
    try {

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const response = await API.post("/admin/availability", formData, {
        headers: {
          Authorization: token,
        }
      })
      console.log(formData)
      // alert("Non-Availability Added Successfully");
      if (response.status === 201) {
        console.log("Non-Availability Added Successfully", response.data)
        navigate("/nonavailability/list")
      }

      setFormData({
        date: "",
        room_id: "",
        count:"",
      });

    } catch (e) {
      console.error("Error in adding non availability", e)
      alert("Error in adding non availability")
    }
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Add Non-Availability</title>
        <meta name="Non-Availability Add" content="Eco Stay Non Availability Add!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Non Availability</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Date */}
        <div className="flex flex-col">
          <label
            htmlFor="date"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Calendar className="h-4 w-4 text-gray-400" />
            From Date
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

        {/* Count */}
        <div className="flex flex-col">
          <label
            htmlFor="count"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Calendar className="h-4 w-4 text-gray-400" />
            Count
          </label>
          <input
            type="number"
            name="count"
            id="count"
            value={formData.count}
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
            Room ID
          </label>
          <select
            name="room_id" // Added name attribute
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

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
          >
            Add Non Availability
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;