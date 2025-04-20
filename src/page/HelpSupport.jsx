import  { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Sidebar from "../component/Sidebar";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineReply } from "react-icons/md";
import { Link } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";



export default function HelpSupport() {
  const [search, setSearch] = useState("");

  const [helpData, setHelpData] = useState([])
  const [filterData, SetFilterData] = useState([])

  
  useEffect(() => {
    if (search) {
      const filtered = filterData.filter((item) =>
        item.email.toLowerCase().includes(search.toLowerCase())
      );
      setHelpData(filtered);
    } else {
      setHelpData(filterData); // Reset data when search is empty
    }
  }, [filterData, search]);


  useEffect(() => {
    fetchHelpSupport();

  }, []);

  const fetchHelpSupport = async () => {
    try {
      const response = await axiosInstance.get("/mainapp/get_help_support/");
      setHelpData(response.data);
      SetFilterData(response.data)
      console.log("location", response.data);
      
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const confirmation = window.confirm("Are you sure delete this row")
      if (!confirmation) {
        return
      }
      const response = await axiosInstance.delete(`/mainapp/delete_help_support/${id}/`);
      if (response.status === 204) {
        setHelpData(helpData.filter((item) => item.id !== id));
        alert("Data Deleted Successfully")
      }
      
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };
  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
  
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const date = dateTime.toLocaleDateString("en-US", options); // "20 Oct 2024"
  
    let hours = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
  
    // Ensure minutes always have two digits (e.g., "09" instead of "9")
    minutes = minutes.toString().padStart(2, "0");
  
    return `${date}, ${hours}:${minutes} ${ampm}`;
  };
  
  

  return (
    <Sidebar title={"Help & Support"}>

    <div className="pr-3">
    

      {/* Search and Sort */}
      <div className="flex justify-between w-full items-center mb-4">
        <div className="flex items-center gap-4 w-full justify-end ">

       <div className="flex border rounded-md overflow-hidden w-1/5 pl-2">
               <button className="">
                   <FaSearch color="#7E7E7E"/>
                 </button>
                 <input
                   type="text"
                   placeholder="Search"
                   
                   className="p-2 w-full focus:outline-none text-sm"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                 />
                 
               </div>
        </div>
      </div>
      
        <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-left">
          <thead>
            <tr className="border-b">
             
              <th className="p-2">Email</th>
              <th className="p-2">Problem</th>
              <th className="p-2">Replied</th>
              <th className="p-2">Date</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {helpData.map((user, index) => (
              <tr key={index} className="border-b">
               
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.problem}</td>
                <td className="p-2">{user.replied || "No Reply"}</td>
                <td className="p-2">{formatDateTime(user.date)}</td>
                <td className="p-2 flex flex-row gap-5">
                  <button>
                  <RiDeleteBin6Line size={18} onClick={()=>handleDelete(user.id)}/> 

                  </button>
                  <Link to="/reply-message" state={{ email: user.email , id: user.id }}>
                <MdOutlineReply size={20}/> 
                </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    

    </div>
    </Sidebar>
  );
}
