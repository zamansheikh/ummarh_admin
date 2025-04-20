import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import Sidebar from "../component/Sidebar";
import { privacyPolicyAPI } from "../component/Api";

const PrivacyPolicy = () => {
  const [text, settext] = useState(``);

  const [textId, settextId] = useState(null);

  const fetchprivacys = async () => {
    try {
      const data = await privacyPolicyAPI.getAll();
      settext(data[0]?.text);
      settextId(data[0]?.id);
    } catch (error) {
      console.error("Failed to fetch privacys:", error);
    }
  };

  useEffect(() => {
    fetchprivacys();
  }, []);

  const handleSave = async () => {
    try {
      const data = await privacyPolicyAPI.save({ text });
      console.log("privacy saved:", data);
      settext(""); // Clear input after save
      fetchprivacys();
      setEdit(false);
      alert("Data Saved Succesfully");
    } catch (error) {
      console.error("Failed to save privacy:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await privacyPolicyAPI.update(textId, { text });
      settext(""); // Clear input after save
      fetchprivacys();
      setEdit(false);
      alert("Data Updated Succesfully");
    } catch (error) {
      console.error("Failed to update privacy:", error);
    }
  };
  const [edit, setEdit] = useState(false);

  return (
    <Sidebar>
      <div className=" flex flex-col items-start justify-center p-4 w-full">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-4 ml-4">Privacy Policy</h1>

        {/* Text Editor */}
        <div className="w-full bg-white rounded-lg p-4  h-[70vh] ">
          <ReactQuill
            value={text}
            onChange={settext}
            theme="snow"
            className="text-sm text-gray-800 h-[60vh] "
            readOnly={!edit}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex  gap-4 mt-4 w-full ml-4">
          {edit ? (
            <div className="flex  gap-4  ">
              {textId ? (
                <button
                  onClick={handleUpdate}
                  className="bg-[#FFDC58]  font-semibold w-[152px] py-2 rounded-md hover:bg-yellow-600 transition "
                >
                  UPDATE
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="bg-[#FFDC58]  font-semibold w-[152px] py-2 rounded-md hover:bg-yellow-600 transition "
                >
                  SAVE
                </button>
              )}
              <button
                onClick={() => setEdit(false)}
                className="bg-white text-[] text-red-500 font-bold px-6 py-2 rounded-md border border-[#FFDC58] hover:bg-red-100 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEdit(true)}
              className="bg-[#FFDC58]  font-semibold w-[152px] py-2 rounded-md hover:bg-yellow-600 transition "
            >
              EDIT
            </button>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default PrivacyPolicy;
