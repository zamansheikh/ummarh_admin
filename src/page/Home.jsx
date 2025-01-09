import React, { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import Dashboard from "../component/Dashborad";
import axiosInstance from "../component/axiosInstance";


const Home = () => {
  const [userData, setUserData] = useState([]);
  const [homeData, setHomeData] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/get_all_subscription/");
        setUserData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching subscriptions data:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchDashbordData = async () => {
      try {
        const response = await axiosInstance.get(
          "/calculate_all_for_dashborad/"
        );
        setHomeData(response.data);
        console.log("f", response.data);
      } catch (error) {
        console.error("Error fetching subscriptions data:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchBarChartData = async () => {
      try {
        const response = await axiosInstance.get("/calculate_yearly_revenue/");
        setBarChartData(response.data.all_revenue_data);
        console.log("bar chart", response.data);
      } catch (error) {
        console.error("Error fetching subscriptions data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchDashbordData();
    fetchBarChartData();
  }, []);

  return (
    <Sidebar>
      <div className="p-6 min-h-screen">
        <Dashboard data={homeData} barChartData={barChartData} />
        <div className="bg-white p-4 rounded-lg shadow-md border border-[#FFDC58] overflow-x-auto">
          <h2 className="text-lg font-bold mb-4">User</h2>
          {loading ? (
            <div className="text-center p-4 text-gray-500">Loading data...</div>
          ) : (
            <table className="w-full table-auto text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-start">Img</th>
                  <th className="p-4 text-center">Name</th>
                  <th className="p-4 text-center">Subscription</th>
                  <th className="p-4 text-right">Email</th>
                </tr>
              </thead>
              <tbody>
                {userData.length > 0 ? (
                  userData.map((user, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition duration-200 ease-in-out"
                    >
                      <td className="p-4 text-center">
                        {user.user_profile?.profile_picture ? (
                          <img
                            src={`${import.meta.env.VITE_REACT_BASE_URL}${
                              user.user_profile?.profile_picture
                            }`}
                            alt={"user"}
                            className="rounded-full w-[40px] h-[40px]"
                          />
                        ) : (
                          <img
                            src="https://via.placeholder.com/40"
                            alt="User"
                            className="rounded-full"
                          />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {user?.user_profile?.username}
                      </td>
                      <td className="p-4 text-center">
                        {user.is_active
                          ? "Premium"
                          : user.is_free || user.free_trial_end
                          ? "Free"
                          : "Subcriptions Expired"}
                      </td>
                      <td className="p-4 text-right">
                        {user?.user_profile?.email}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                      No user data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default Home;
