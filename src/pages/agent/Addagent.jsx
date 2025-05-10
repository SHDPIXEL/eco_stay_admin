import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Home,
  FileText,
  CheckCircle,
  Tag,
} from "lucide-react";
import { useLocation } from "react-router";
import API from "../../lib/utils";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";

const AddAgent = () => {
  const location = useLocation();
  const agentData = location.state?.agentData;
  const navigate = useNavigate();
  const [fileInfo, setFileInfo] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(""); // for dropdown
  const [offerAmount, setOfferAmount] = useState(""); // for input
  const [roomOffers, setRoomOffers] = useState({}); // stores all added offers

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    idProof: "",
    status: "",
    password: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  useEffect(() => {
    if (agentData) {
      setFormData({
        name: agentData.name || "",
        email: agentData.email || "",
        phone: agentData.phone || "",
        address: agentData.address || "",
        idProof: agentData.idProof || "",
        status: agentData.status || "",
        offers: agentData.offers || "",
        password: "",
        city: agentData.city || "",
        state: agentData.state || "",
        country: agentData.country || "",
        pincode: agentData.pincode || "",
      });
      // ✅ Properly parse and load offers into roomOffers
      if (agentData.offers) {
        let parsedOffers = [];
        try {
          parsedOffers = JSON.parse(agentData.offers);
        } catch (e) {
          console.warn("Failed to parse offers", agentData.offers);
        }

        if (Array.isArray(parsedOffers)) {
          const offerMap = {};
          parsedOffers.forEach((item) => {
            const [room, price] = item.split(":");
            if (room && price) {
              offerMap[room] = price;
            }
          });
          setRoomOffers(offerMap);
        }
      }
    }
  }, [agentData]);

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

  const [errors, setErrors] = useState({}); // State to store validation errors

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Validates a 10-digit number starting with 6, 7, 8, or 9
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "phone") {
      if (!validatePhoneNumber(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: "Invalid phone number",
        }));
      } else {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors.phone;
          return newErrors;
        });
      }
    }
  };

  const handleRoomOfferChange = (roomName, value) => {
    setRoomOffers((prev) => ({
      ...prev,
      [roomName]: value,
    }));
  };

  const handleAddOffer = () => {
    if (!selectedRoom || isNaN(offerAmount) || Number(offerAmount) <= 0) {
      alert("Please select a room and enter a valid offer amount.");
      return;
    }

    setRoomOffers((prev) => ({
      ...prev,
      [selectedRoom]: offerAmount,
    }));

    // Clear inputs
    setSelectedRoom("");
    setOfferAmount("");
  };

  // const handleOffersChange = (e) => {
  //   const { value } = e.target;
  //   if (e.key === "Enter" && value.trim()) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       offers: [...prev.offers, value.trim()],
  //     }));
  //     e.preventDefault();
  //   }
  // };

  // const handleDeleteOffer = (offerToDelete) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     offers: prev.offers.filter((offer) => offer !== offerToDelete),
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Phone Number
    if (!validatePhoneNumber(formData.phone)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: "Invalid phone number",
      }));
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authorization token is missing");

      const formDataToSend = new FormData();
      const isUpdating = Boolean(agentData);

      if (isUpdating) {
        const { id } = agentData;
        if (!id) throw new Error("Agent ID is missing");

        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("status", formData.status);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("city", formData.city);
        formDataToSend.append("state", formData.state);
        formDataToSend.append("country", formData.country);
        formDataToSend.append("pincode", formData.pincode);

        const offersArray = Object.entries(roomOffers).map(
          ([room, price]) => `${room}:${price}`
        );
        formDataToSend.append("offers", JSON.stringify(offersArray));

        if (formData.idProof && formData.idProof instanceof File) {
          formDataToSend.append("idProof", formData.idProof);
        }

        const response = await API.put(`/admin/agent/${id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201 || response.status === 200) {
          console.log("Agent updated successfully:", response.data);
          alert("Agent updated successfully");
          navigate("/agent/list");
        }
      } else {
        if (
          !formData.name ||
          !formData.email ||
          !formData.phone ||
          !formData.address ||
          !formData.idProof ||
          !formData.status ||
          !Object.keys(roomOffers).length === 0 ||
          !formData.password ||
          !formData.state ||
          !formData.city ||
          !formData.country ||
          !formData.pincode
        ) {
          throw new Error("Please fill in all required fields");
        }

        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("idProof", formData.idProof);
        formDataToSend.append("status", formData.status);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("city", formData.city);
        formDataToSend.append("state", formData.state);
        formDataToSend.append("country", formData.country);
        formDataToSend.append("pincode", formData.pincode);
        const offersArray = Object.entries(roomOffers).map(
          ([room, price]) => `${room}:${price}`
        );
        formDataToSend.append("offers", JSON.stringify(offersArray));

        // Try creating a new agent
        const response = await API.post("/admin/agent", formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          console.log("Agent added successfully:", response.data);
          alert("Agent added successfully");
          navigate("/agent/list");
        }
      }
    } catch (e) {
      console.error("Error in submitting agent:", e);
      alert(e.error);
    }
  };

  // File handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (3 MB limit)
      if (file.size < 1 * 1024 * 1024) {
        // Update file information state
        setFileInfo({
          name: file.name,
          type: file.type,
          size: file.size,
        });

        // Update form data state with the selected file
        setFormData((prev) => ({ ...prev, idProof: file }));
      } else {
        alert("File size exceeds 1 MB");
        e.target.value = null; // Clear the file input
        setFileInfo(null); // Clear the displayed file info
      }
    }
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Add Agent</title>
        <meta name="Add Agent" content="Eco Stay Add agent!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {agentData ? "Edit Agent" : "Add New Agent"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Name */}
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <User className="h-4 w-4 text-gray-400" />
            Agent Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter agent name"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Mail className="h-4 w-4 text-gray-400" />
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter email"
            required
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label
            htmlFor="phone"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Phone className="h-4 w-4 text-gray-400" />
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter phone number"
            required
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Address */}
        <div className="flex flex-col">
          <label
            htmlFor="address"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Home className="h-4 w-4 text-gray-400" />
            Address
          </label>
          <textarea
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter address"
            required
          />
        </div>

        {/* city */}
        <div className="flex flex-col">
          <label
            htmlFor="city"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-gray-400" />
            City
          </label>
          <input
            name="city"
            id="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter City"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none transition-all duration-200"
            required
          />
        </div>

        {/* state */}
        <div className="flex flex-col">
          <label
            htmlFor="state"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-gray-400" />
            State
          </label>
          <input
            name="state"
            id="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter State"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none transition-all duration-200"
            required
          />
        </div>

        {/* pincode */}
        <div className="flex flex-col">
          <label
            htmlFor="pincode"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-gray-400" />
            Pincode
          </label>
          <input
            name="pincode"
            id="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Enter Pincode"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none transition-all duration-200"
            required
          />
        </div>

        {/* country */}
        <div className="flex flex-col">
          <label
            htmlFor="country"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-gray-400" />
            Country
          </label>
          <input
            name="country"
            id="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter Country"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none transition-all duration-200"
            required
          />
        </div>

        {/* ID Proof */}
        <div className="flex flex-col">
          <label
            htmlFor="idProof"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <FileText className="h-4 w-4 text-gray-400" />
            ID Proof
          </label>
          <input
            type="file"
            name="idProof"
            id="idProof"
            accept="image/*, .pdf"
            onChange={handleFileChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
          />
          {fileInfo && (
            <div className="mt-3 text-sm text-gray-600">
              <p>
                <strong>File Name:</strong> {fileInfo.name}
              </p>
              <p>
                <strong>File Type:</strong> {fileInfo.type}
              </p>
              <p>
                <strong>File Size:</strong> {(fileInfo.size / 1024).toFixed(2)}{" "}
                KB
              </p>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label
            htmlFor="status"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-gray-400" />
            Status
          </label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none transition-all duration-200"
            required
          >
            <option value="" disabled>
              Select status
            </option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Offers */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-gray-400" />
            Offers per Room
          </label>

          <div className="flex gap-3 items-center">
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg flex-1"
            >
              <option value="">Select Room</option>
              {rooms
                .filter((r) => !roomOffers[r.room_name]) // avoid duplicates
                .map((room) => (
                  <option key={room.id} value={room.room_name}>
                    {room.room_name}
                  </option>
                ))}
            </select>

            <input
              type="number"
              min="0"
              placeholder="Offer amount"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-32"
            />

            <button
              onClick={handleAddOffer}
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </div>

          {/* Show current offers */}
          {Object.entries(roomOffers).map(([room, amount]) => (
            <div
              key={room}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {room}: ₹{amount}
              </span>
              <button
                type="button"
                onClick={() =>
                  setRoomOffers((prev) => {
                    const updated = { ...prev };
                    delete updated[room];
                    return updated;
                  })
                }
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* <div className="flex flex-col">
          <label
            htmlFor="offers"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Tag className="h-4 w-4 text-gray-400" />
            Offers
          </label>
          <div className="flex flex-wrap gap-2">
            {formData.offers.map((offer, index) => (
              <span
                key={index}
                className="flex items-center justify-between bg-[#333] text-white text-sm rounded-xl px-3"
              >
                {offer}
                <button
                  type="button"
                  onClick={() => handleDeleteOffer(offer)}
                  className="ml-2 text-red-400 hover:text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
            <input
              type="text"
              name="offers"
              id="offers"
              onKeyDown={handleOffersChange}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              placeholder="Add offers (press Enter to add)"
            />
          </div>
        </div> */}

        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-gray-400" />
            Password(Enter a password only if you want to update it else skip)
          </label>
          <input
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none transition-all duration-200"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
          >
            {agentData ? "Update Agent" : "Add Agent"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAgent;
