/* eslint-disable react/prop-types */
import  { useState } from "react";
import { RiDeleteBin6Line , RiEditLine } from "react-icons/ri";
import ReactQuill from "react-quill";
import axiosInstance from "../component/axiosInstance";
import { FaUpload } from "react-icons/fa";
import ImageResize from "quill-image-resize-module-react";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
    ["link", "image", "video"], // Enable image & video upload
  ],
  clipboard: {
    matchVisual: false,
  },
  imageResize: {
    displayStyles: {
      backgroundColor: "black",
      border: "none",
      color: "white",
    },
    modules: ["Resize", "DisplaySize", "Toolbar"],
  },
};

// Register the ImageResize module
ReactQuill.Quill.register("modules/imageResize", ImageResize);
export default function BlogList({ data, onDelete , fetchBlog }) {

  const [isModalOpen, setModalOpen] = useState(false)
  const [text, setText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // State to hold the image preview
  const [imageFile, setImageFile] = useState(null); // State for holding the image file for upload
  const [title, setTitle] = useState("")
  const [id, setId] = useState(null)

  const handleupdate = async () => {
    try {
      if ( !imagePreview || !text || !title) {
        alert("Please fill in all fields.");
        return;
      }
    
      const formData = new FormData();
      formData.append("location_id", selectedLocation);
      formData.append("title", title); // Title from the input
      if (imageFile) {
        
        formData.append("image", imageFile); // Image file
      }
      formData.append("description", text); // Description from the editor
      const token = localStorage.getItem("authToken")
      const response = await axiosInstance.put(`/mainapp/blogs/${id}/`, formData,{
        headers: {
          Authorization:` Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        setModalOpen(false)
        alert("Blog Updated Sucessfully")
        fetchBlog()
      }
      
    } catch (error) {
      console.error("Error fetching Cities:", error);
    }
  };
  // Handle Edit Button Click
  const handleEditClick = (post) => {
    console.log(post);
    
    setSelectedLocation(post.location?.id)
    setId(post.id)
    setTitle(post.title);
    setText(post.description);
    setImagePreview(post.image); // Set existing image as preview
    setModalOpen(true);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
      setImageFile(file); // Set the image file for upload
    }
  };
  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4">Blog List</h2>

      {/* Blog Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Image</th>
              <th className="p-2">Blog Title</th>
              <th className="p-2">Description</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((post, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 ">
                  <img src={post.image} alt="Blog" className="w-[140px] h-[100px] bg-cover rounded" />
                </td>
                <td className="p-2">{post.title}</td>
                <td className="p-2 max-h-[5rem]  overflow-hidden text-ellipsis" 
                    style={{
                      display: "-webkit-box", 
                      WebkitLineClamp: 3, 
                      WebkitBoxOrient: "vertical"
                    }} 
                    dangerouslySetInnerHTML={{ __html: post.description }} />
                <td className="p-2 ">
                <button
                      onClick={() => handleEditClick(post)} // Edit button
                      className="text-blue-500 hover:text-blue-700 "
                    >
                      <RiEditLine size={20} />
                    </button>
                  <button 
                    className="text-red-500 hover:text-red-700 "
                    onClick={() => onDelete(post.id)} // Handle delete click
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 w-[60vw] rounded-md shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Edit Blog</h3>

            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write your title"
              className="w-full pl-2 h-[5vh] border border-gray-[rgba(34, 34, 34, 0.49)] rounded-md mb-4"
            />

            {/* Blog Image Upload Section */}
            <div className="flex flex-col items-center mb-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer w-full h-[12vh] border border-gray-[rgba(34, 34, 34, 0.49)] rounded-md text-center flex flex-col items-center justify-center"
              >
                <FaUpload className="text-4xl text-gray-500 mb-2" />
                <span className="text-gray-500">Blog Image</span>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="mt-3 w-full flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-[200px] max-h-[200px] object-cover border rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Description Editor */}
            <ReactQuill
              value={text}
              onChange={setText}
              modules={modules} // Enable toolbar with image upload
              theme="snow"
              className="text-sm text-gray-800 w-full h-[30vh] mb-4"
              placeholder="Write your description"
            />

            {/* Save Button */}
            <div className="flex justify-end mt-16">
              <button
                onClick={handleupdate}
                className="px-10 py-2 bg-[#C9A038] rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 bg-gray-300 rounded-md ml-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
