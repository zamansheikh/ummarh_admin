/* eslint-disable react/prop-types */
import { IoClose } from "react-icons/io5";
import unverify from "../assets/unverify.png"
const ProfileModal = ({ visible, onReject, onApprove, onClose, data }) => {
  console.log("data", data);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>

        {/* Profile Image */}
        <div className="flex justify-center">
          <img
            src={data.image || ""}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>

        {/* Profile Details */}
        <div className="text-center flex-col flex items-center  mt-3">
          <h2 className="text-xl flex items-center font-semibold">
            {data.name} 
            <span className="text-sm">
              {data.is_verified ? (
                <img 
                  src="https://cdn-icons-png.flaticon.com/128/5962/5962703.png" // Use your verified image path here
                  alt="Verified"
                  className="inline "
                  style={{ width: '23px', height: '23px' }}
                />
              ) : (
                <img 
                  src={unverify} // Use your not-verified image path here
                  alt="Not Verified"
                  className="inline "
                  style={{ width: '25px', height: '25px' }}
                />
              )}
            </span>
          </h2>
          <p className="text-gray-500 text-sm">Tourist Guide</p>
        </div>

        {/* Bio Description */}
        <p className="text-gray-600 text-sm text-center mt-3">
          {data.about_us}
        </p>

        {/* Contact Information */}
        <div className="mt-5 space-y-2">
          <div>
            <p className="text-gray-500 text-sm font-semibold">Phone Number</p>
            <p className="text-gray-800">{data.phone_number}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Address</p>
            <p className="text-gray-800">
              {data.address}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Card Number</p>
            <p className="text-gray-800">
              {data.guide_card_number}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Language</p>
            <p className="text-gray-800">
              <ul className="flex gap-3">
                {data.languages?.map((language, index) => (
                  <li key={index}>{language}</li>
                ))}
              </ul>
            </p>
          </div>
        </div>


        {!data.is_verified && (

        <div className="mt-6 flex justify-between">
          <button
            className="border border-red-500  px-4 py-2 rounded-md w-1/2 mr-2"
            onClick={onReject}
          >
            Reject
          </button>
          <button
            className="bg-[#C9A038] text-white px-4 py-2 rounded-md w-1/2 "
            onClick={() => onApprove()}
          >
            Approve
          </button>
        </div>
        )}

      </div>
    </div>
  );
};

export default ProfileModal;
