import  { useState } from "react";
import Sidebar from "../component/Sidebar";

import "react-quill/dist/quill.snow.css"; // Import Quill styles

import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";
import { useAuth } from "../component/AuthContext";




export default function ReplyMessages() {
  const [text, settext] = useState("");
  const {auth} = useAuth()
  const navigate = useNavigate()

  

  const location = useLocation()
  const { email ,id } = location.state || {};
  


  
  const handleSendReply = async () => {
    try {
      const response = await axiosInstance.post(`/mainapp/send-reply/${id}/`,{
        email, text,
      },{
        headers:{
          Authorization:` Bearer ${auth.token}`,
        }
      });
     
      if (response.status === 200) {
        navigate(-1)
        alert("Reply send Succesfully")
      }
      
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };


  return (
    <Sidebar title={"Reply Message"}>
      <div className="pr-3">

        {/* User Table */}
       

        <div className="flex flex-col gap-5">
            <div className="px-4">

          <input type="text" placeholder="Email address" value={email} className="w-full pl-2 h-[5vh] border border-gray-[rgba(34, 34, 34, 0.49)] rounded-md" />
            </div>
          <div className="w-full bg-white rounded-lg p-4 h-[30vh]">
            <textarea
              value={text}
              onChange={(e)=>settext(e.target.value)}
              className="text-sm outline-none h-[30vh] border w-full px-3 rounded-sm py-2"
              placeholder="Write your reply"
            />
          </div>
          <div className="mt-12 flex items-end justify-end mr-3" onClick={handleSendReply}>
            <button className="px-10 rounded-md py-2 bg-[#C9A038]">Save</button>
          </div>
        </div>
       
      </div>
    </Sidebar>
  );
}
