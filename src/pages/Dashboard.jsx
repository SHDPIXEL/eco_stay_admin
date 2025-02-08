import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { Users, Calendar, Type } from "lucide-react";
import API from "../lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import renderActiveShape from "../components/pieCharShape";
import { Helmet } from "react-helmet-async";

const Dashboard = () => {
  const [data, setData] = useState();
  const [totalUsers, setTotalUsers] = useState();
  const [totalAgents, setTotalAgents] = useState();
  const [totalRooms, SetTotalRooms] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [bookingChartData, setBookingChartData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/booking-details");
        const parsedata = response.data;
        setData(parsedata.length);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/user");
        const parsedata = response.data;
        setTotalUsers(parsedata.length);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/agent");
        const parsedata = response.data;
        setTotalAgents(parsedata.length);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/room");
        const parsedata = response.data;
        SetTotalRooms(parsedata.length);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBookingChartData = async () => {
      const response = await API.get("admin/booking-details/graph");
      const data = response.data.data;
      setBookingChartData(data);
    }
    fetchBookingChartData()
  },[])

  const UserAgentPieCharData = [
    { name: "User", value: totalUsers || 0 },
    { name: "Agents", value: totalAgents || 0 },
  ];

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const COLORS = ["#0088FE", "#00C49F"];


  const DashboardItems = [
    { title: "Total Bookings", value: data || 0, icon: <Calendar className="w-5 h-5" /> },
    { title: "Total Users", value: totalUsers || 0, icon: <Users className="w-5 h-5" /> },
    { title: "Total Agents", value: totalAgents || 0, icon: <Users className="w-5 h-5" /> },
    { title: "Total Rooms", value: totalRooms || 0, icon: <Type className="w-5 h-5" /> },
  ];

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <Helmet>
        <title>Eco Stay | Dashboard</title>
        <meta name="Dachboard" content="Eco Stay Dashboard!" />
      </Helmet>
      {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-6 mt-20">
          {DashboardItems.map((item, index) => (
            <Card key={index} title={item.title} value={item.value} icon={item.icon} />
          ))}
        </div>
     
        {/* Charts Section */}
        <div className="grid items-center justify-center grid-cols-1 md:grid-cols-2 gap-8 mt-10 px-6">
          <div className="h-80 flex flex-col items-center justify-center shadow-sm bg-white p-6 space-y-5">
            <ResponsiveContainer>
              <LineChart
                data={bookingChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#333" }}
                  tickFormatter={(tick) => {
                    const date = new Date(tick);
                    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                  }}
                />
                <YAxis tick={{ fill: "#333" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                  }}
                  itemStyle={{ color: "#333" }}
                />
                <Legend wrapperStyle={{ color: "#333" }} />
                <Line
                  type="monotone"
                  dataKey="booking"
                  stroke="#00C49F"
                  strokeWidth={2}
                  activeDot={{ r: 10 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="font-bold text-gray-600 text-xl mt-2">
              Booking Trends
            </p>
          </div>



          {/* Pie Chart */}
          <div className="h-80 flex flex-col items-center justify-center shadow-sm bg-white p-6 space-y-5">
            <ResponsiveContainer>
              <PieChart
              >
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={UserAgentPieCharData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {UserAgentPieCharData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <p className="font-bold text-gray-600 text-xl mt-2">
              Users <span className="text-[#00C49F]">vs</span> Agents
            </p>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;
