import React, { useEffect, useState } from "react";
import {
  Package,
  Tag,
  Image,
  Home,
  Type,
  PersonStanding,
  BadgeIndianRupee,
  Album,
  Rows3,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import API from "../../lib/utils";
import { Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { formatDate } from "date-fns";

const AddType = () => {
  const location = useLocation();
  const roomData = location.state?.roomData;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    room_name: "",
    type: "",
    capacity: "",
    single_base_price: 0,
    double_base_price: 0,
    triple_base_price: 0,
    single_new_price: 0,
    double_new_price: 0,
    triple_new_price: 0,
    package_ids: [],
    description: "",
    amenities: [],
    room_images: "",
    status: "Inactive", // Default to "Inactive"
  });

  const [packages, setPackage] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authorization token is missing");
        }

        const response = await API.get(`/admin/package`, {
          headers: {
            Authorization: token,
          },
        });

        const packages = response.data;
        const formattedPackages = packages.map((pack) => ({
          id: pack.id,
          pack_name: pack.name,
        }));
        setPackage(formattedPackages);
        console.log("Packages fetched successfully:", formattedPackages);
      } catch (error) {
        console.error("Error fetching packages:", error);

        // Improved error logging to catch specific details
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
        } else if (error.request) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    if (roomData) {
      console.log("exisitng image", roomData.room_images);
      setFormData({
        room_name: roomData.room_name || "",
        type: roomData.type || "",
        capacity: roomData.capacity || 1,
        single_base_price: roomData.single_base_price || "",
        double_base_price: roomData.double_base_price || "",
        triple_base_price: roomData.triple_base_price || "",
        single_new_price: roomData.single_new_price || "",
        double_new_price: roomData.double_new_price || "",
        triple_new_price: roomData.triple_new_price || "",
        package_ids: Array.isArray(roomData.package_ids)
          ? roomData.package_ids
          : [],
        description: roomData.description || "",
        amenities: JSON.parse(roomData.amenities) || [],
        room_images: (() => {
          try {
            // If room_images is already an array, return it as is
            if (Array.isArray(roomData.room_images)) {
              return roomData.room_images;
            }

            // Check if room_images is a string and has extra quotes
            let cleanedRoomImages = roomData.room_images;

            // Ensure it's a string
            if (typeof cleanedRoomImages === "string") {
              // Remove extra escape characters or quotes if necessary
              if (
                cleanedRoomImages.startsWith('"') &&
                cleanedRoomImages.endsWith('"')
              ) {
                cleanedRoomImages = cleanedRoomImages.slice(1, -1);
              }

              // Return the parsed array
              return cleanedRoomImages ? JSON.parse(cleanedRoomImages) : [];
            }

            // If room_images is not a string or array, return an empty array
            return [];
          } catch (error) {
            console.error("Error parsing room_images:", error);
            return [];
          }
        })(),

        status: roomData.status || "Inactive", // Now directly sets "Active" or "Inactive"
      });
    }
  }, [roomData]);

  const handlePackageSelect = (e) => {
    const { value } = e.target;
    const selectedId = parseInt(value, 10);
    if (selectedId && !formData.package_ids.includes(selectedId)) {
      setFormData((prev) => ({
        ...prev,
        package_ids: [...prev.package_ids, selectedId],
      }));
    }
  };

  const handleDeletePackage = (packageToDelete) => {
    setFormData((prev) => ({
      ...prev,
      package_ids: prev.package_ids.filter((id) => id !== packageToDelete),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: Number(value), // Ensures it's a number (0 stays 0)
    }));
  };

  const handleTagsChange = (e) => {
    const { value } = e.target;

    if (
      (e.key === "Enter" || e.keyCode === 13 || e.code === "Enter") &&
      value.trim()
    ) {
      e.preventDefault();
      addTag(value.trim());
    }
  };

  const handleTagsBlur = (e) => {
    const { value } = e.target;
    if (value.trim()) {
      addTag(value.trim());
    }
  };

  const addTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      amenities: [...prev.amenities, tag],
    }));

    document.getElementById("tags").value = "";
  };

  const handleDeleteTag = (indexToDelete) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, index) => index !== indexToDelete),
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (formData.room_images.length + files.length > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }

    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      room_images: [...prev.room_images, ...newPreviews],
    }));
  };

  const handleDeleteImage = (indexToDelete) => {
    setFormData((prev) => ({
      ...prev,
      room_images: prev.room_images.filter(
        (_, index) => index !== indexToDelete
      ),
    }));
  };

  // const handleCottageChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     status: {
  //       ...prev.status,
  //       [name]: parseInt(value) || 0,
  //     },
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authorization token is missing");

      // Convert values to float for comparison
      const singleBasePrice = parseFloat(formData.single_base_price);
      const singleNewPrice = parseFloat(formData.single_new_price);
      const doubleBasePrice = parseFloat(formData.double_base_price);
      const doubleNewPrice = parseFloat(formData.double_new_price);
      const tripleBasePrice = parseFloat(formData.triple_base_price);
      const tripleNewPrice = parseFloat(formData.triple_new_price);

      // Validation check
      if (singleBasePrice >= singleNewPrice) {
        alert("Single base price must be smaller than single new price.");
        return;
      }

      if (doubleBasePrice >= doubleNewPrice) {
        alert("Double base price must be smaller than double new price.");
        return;
      }

      if (tripleBasePrice >= tripleNewPrice) {
        alert("Triple base price must be smaller than Triple new price.");
        return;
      }

      // Add checks to prevent setting prices to negative values or undefined
      if (
        singleBasePrice < 0 ||
        singleNewPrice < 0 ||
        doubleBasePrice < 0 ||
        doubleNewPrice < 0 ||
        tripleBasePrice < 0 ||
        tripleNewPrice < 0
      ) {
        alert("Prices cannot be negative.");
        return;
      }

      const formDataToSend = new FormData();

      if (roomData) {
        // Update existing room
        const { id } = roomData;
        if (!id) throw new Error("Room ID is missing");

        // Prepare update data
        const updateData = {
          room_name: formData.room_name,
          type: formData.type,
          capacity: 1,
          single_base_price: singleBasePrice,
          single_new_price: singleNewPrice,
          double_base_price: doubleBasePrice,
          double_new_price: doubleNewPrice,
          triple_base_price: tripleBasePrice,
          triple_new_price: tripleNewPrice,
          description: formData.description,
          package_ids: formData.package_ids,
          amenities: formData.amenities,
          status: formData.status, // Directly storing "Active" or "Inactive"
          room_images: formData.room_images.filter((img) => !img.file), // Keep only existing images
        };

        console.log("updateed data", updateData);

        formDataToSend.append("room_data", JSON.stringify(updateData));

        console.log("sdssd", formDataToSend.room_images);
        formData.room_images.forEach((image) => {
          if (image.file) {
            formDataToSend.append("room_images", image.file);
          }
        });

        console.log("Room data to send:");
        for (let pair of formDataToSend.entries()) {
          console.log(`${pair[0]}:`, pair[1]);
        }

        const response = await API.put(`/admin/room/${id}`, formDataToSend, {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          alert("Room updated successfully");
          navigate("/roomtype/list");
        }
      } else {
        if (
          !formData.room_name ||
          !formData.type ||
          !formData.capacity ||
          !formData.single_base_price ||
          !formData.double_base_price ||
          !formData.single_new_price ||
          !formData.double_new_price ||
          !formData.triple_base_price ||
          !formData.triple_new_price
        ) {
          throw new Error("Please fill in all required fields");
        }

        const roomDataArray = [
          {
            room_name: formData.room_name,
            type: formData.type,
            capacity: parseInt(formData.capacity),
            single_base_price: singleBasePrice,
            single_new_price: singleNewPrice,
            double_base_price: doubleBasePrice,
            double_new_price: doubleNewPrice,
            triple_base_price: tripleBasePrice,
            triple_new_price: tripleNewPrice,
            description: formData.description,
            package_ids: formData.package_ids,
            amenities: formData.amenities,
            status: formData.status,
          },
        ];

        // Append the array as JSON
        formDataToSend.append("room_data", JSON.stringify(roomDataArray));

        if (formData.room_images && formData.room_images.length > 0) {
          formData.room_images.forEach((image) => {
            if (image.file) {
              formDataToSend.append("room_images", image.file);
            }
          });
        }

        const response = await API.post("/admin/room", formDataToSend, {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("form data to send", formDataToSend);

        if (response.status === 200 || response.status === 201) {
          console.log("Room added successfully:", response.data);
          navigate("/roomtype/list");
        }
      }
    } catch (error) {
      console.error("Error submitting room:", error);
      console.error("Error details:", error.response?.data);
      alert(
        error.response?.data?.message ||
          "Error processing room. Please try again."
      );
    }
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Add Room</title>
        <meta name="Add Room" content="Eco Stay Add Room!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {roomData ? "Edit Room" : "Add New Room"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Room Name */}
        <div className="flex flex-col">
          <label
            htmlFor="room_name"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Home className="h-4 w-4 text-gray-400" />
            Room Name
          </label>
          <input
            type="text"
            name="room_name"
            id="room_name"
            value={formData.room_name}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter room name"
            required
          />
        </div>

        {/* Type */}
        <div className="flex flex-col">
          <label
            htmlFor="type"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Type className="h-4 w-4 text-gray-400" />
            Room Type
          </label>
          <input
            type="text"
            name="type"
            id="type"
            value={formData.type}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter type"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="capacity"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <PersonStanding className="h-4 w-4 text-gray-400" />
            Capacity
          </label>
          <input
            type="text"
            name="capacity"
            id="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter type"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="single_base_price"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <BadgeIndianRupee className="h-4 w-4 text-gray-400" />
            Old Single Occupancy Price(INR)
          </label>
          <input
            type="number"
            name="single_base_price"
            id="single_base_price"
            value={formData.single_base_price}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter base price"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="single_new_price"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <BadgeIndianRupee className="h-4 w-4 text-gray-400" />
            Offer Single Occupancy Price New(INR)
          </label>
          <input
            type="number"
            name="single_new_price"
            id="single_new_price"
            value={formData.single_new_price}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter base price"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="double_base_price"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <BadgeIndianRupee className="h-4 w-4 text-gray-400" />
            Old Double Occupancy Price(INR)
          </label>
          <input
            type="number"
            name="double_base_price"
            id="double_base_price"
            value={formData.double_base_price}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter base price"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="double_new_price"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <BadgeIndianRupee className="h-4 w-4 text-gray-400" />
            Offer Double Occupancy Price New(INR)
          </label>
          <input
            type="number"
            name="double_new_price"
            id="double_new_price"
            value={formData.double_new_price}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter base price"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="triple_base_price"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <BadgeIndianRupee className="h-4 w-4 text-gray-400" />
            Old Triple Occupancy Price(INR)
          </label>
          <input
            type="number"
            name="triple_base_price"
            id="triple_base_price"
            value={formData.triple_base_price}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter base price"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="triple_new_price"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <BadgeIndianRupee className="h-4 w-4 text-gray-400" />
            Offer Triple Occupancy Price New(INR)
          </label>
          <input
            type="number"
            name="triple_new_price"
            id="triple_new_price"
            value={formData.triple_new_price}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter base price"
            required
          />
        </div>

        {/* Package ID */}
        <div className="flex flex-col">
          <label
            htmlFor="package_ids"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Album className="h-4 w-4 text-gray-400" />
            Package IDs
          </label>
          <select
            id="package_ids"
            onChange={handlePackageSelect}
            className="p-3 rounded-lg border border-gray-300"
          >
            <option value="">Select Package</option>
            {packages.map((pack) => (
              <option key={pack.id} value={pack.id}>
                {pack.pack_name}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2 mt-3">
            {formData.package_ids.map((id, index) => {
              const packageName =
                packages.find((p) => p.id === id)?.pack_name ||
                "Unknown Package";
              return (
                <span
                  key={index}
                  className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700"
                >
                  {packageName}
                  <button
                    type="button"
                    onClick={() => handleDeletePackage(id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </span>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Rows3 className="h-4 w-4 text-gray-400" />
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter description"
            required
          />
        </div>

        {/* Amenities (Tags) */}
        <div className="flex flex-col">
          <label
            htmlFor="tags"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Tag className="h-4 w-4 text-gray-400" />
            Amenities (Tags)
          </label>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(formData.amenities) &&
              formData.amenities.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center justify-between bg-[#333] text-white text-sm rounded-xl px-3"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleDeleteTag(index)}
                    className="ml-2 text-red-400 hover:text-red-500"
                  >
                    &times;
                  </button>
                </span>
              ))}

            <input
              type="text"
              name="tags"
              id="tags"
              onKeyDown={handleTagsChange}
              onBlur={handleTagsBlur}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              placeholder="Add tags (press Enter to add)"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            Room Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Room Images */}
        <div className="flex flex-col">
          <label
            htmlFor="room_images"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Image className="h-4 w-4 text-gray-400" />
            Room Images
            {roomData && (
              <span className="text-gray-500 text-xs italic">
                (Upload a new image only if you wish to update, else the
                existing ones will be retained)
              </span>
            )}
          </label>
          <input
            type="file"
            name="room_images"
            id="room_images"
            accept="image/*"
            onChange={handleImageChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            required={roomData ? false : true}
            multiple
          />

          {formData.room_images.length > 0 && (
            <div className="mt-3 flex gap-3 flex-wrap">
              {formData.room_images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview || image}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
          >
            {roomData ? "Update Room" : "Add Room"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddType;
