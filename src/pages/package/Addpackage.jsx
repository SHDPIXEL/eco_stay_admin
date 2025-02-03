import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Package, Clock, Home, BadgeIndianRupee } from "lucide-react";
import API from "../../lib/utils";
import { Helmet } from "react-helmet-async";

const AddPackage = () => {
  const location = useLocation();
  const packageData = location.state?.packageData;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    package_price: "",
    long_description: "",
    short_description: "",
    status: "",
  });

  useEffect(() => {

    if (packageData) {
      setFormData({
        name: packageData.name || "",
        package_price: packageData.package_price || "",
        long_description: packageData.long_description || "",
        short_description: packageData.short_description || "",
        status: packageData.ontype || "",
      });
    }
  }, [packageData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      if (packageData) {
        const { id } = packageData;
        if (!id) {
          throw new Error("Package ID is missing");
        }

        // Update API Call
        const response = await API.put(`/admin/package/${id}`, formData, {
          headers: {
            Authorization: token,
          },
        });
        // console.log("updated data", formData)

        if (response.status === 200) {
          console.log("Package updated successfully", response.data);
          alert("Package updated successfully");
          navigate("/packages/list");
        }
      } else {
        // Create API Call
        const response = await API.post("/admin/package", formData, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 201) {
          console.log("Package added successfully", response.data);
          alert("Package added successfully");
          navigate("/packages/list");
        }
      }

      // Reset the form data
      setFormData({
        name: "",
        room_id: "",
        package_price: "",
        long_description: "",
        short_description: "",
        status: "",
      });
    } catch (error) {
      console.error(
        "Error while submitting package:",
        error.response?.data || error.message
      );
      alert("An error occurred. Please try again.");
    }
  };


  const PackageType = ["Active", "Inactive"];

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Add Package</title>
        <meta name="Package Add" content="Eco Stay Add Package!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {packageData ? "Edit Package" : "Add New Package"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Package Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            Package Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter package name"
            required
          />
        </div>

        {/* Package Price */}
        <div className="flex flex-col">
          <label htmlFor="package_price" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <BadgeIndianRupee className="h-4 w-4 text-gray-400" />
            Price (INR)
          </label>
          <input
            type="number"
            name="package_price"
            id="package_price"
            value={formData.package_price}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter Price"
            min="0"
            required
          />
        </div>

        {/* Long Description */}
        <div className="flex flex-col">
          <label htmlFor="long_description" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            Key elements
          </label>
          <textarea
            name="long_description"
            id="long_description"
            value={formData.long_description}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter long description"
            required
          />
        </div>

        {/* Short Description */}
        <div className="flex flex-col">
          <label htmlFor="short_description" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            Description
          </label>
          <input
            type="text"
            name="short_description"
            id="short_description"
            value={formData.short_description}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter short description"
            required
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Home className="h-4 w-4 text-gray-400" />
            Package status
          </label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            required
          >
            <option value="" disabled>
              Select Status
            </option>
            {PackageType.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="px-6 py-3 w-full bg-black text-white rounded-lg">
          {packageData ? "Update Package" : "Add Package"}
        </button>
      </form>
    </div>
  );
};

export default AddPackage;
