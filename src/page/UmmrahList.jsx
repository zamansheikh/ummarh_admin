/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { RiDeleteBin6Line, RiEditLine } from 'react-icons/ri';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axiosInstance from '../component/axiosInstance';
import { FaUpload } from 'react-icons/fa';
import ImageResize from 'quill-image-resize-module-react';

// Quill modules configuration
const modules = {
	toolbar: [
		[{ header: [1, 2, false] }],
		['bold', 'italic', 'underline', 'strike'],
		[{ list: 'ordered' }, { list: 'bullet' }],
		['blockquote', 'code-block'],
		[{ script: 'sub' }, { script: 'super' }],
		[{ indent: '-1' }, { indent: '+1' }],
		[{ direction: 'rtl' }],
		[{ size: ['small', false, 'large', 'huge'] }],
		[{ color: [] }, { background: [] }],
		[{ font: [] }],
		[{ align: [] }],
		['clean'],
		['link', 'image', 'video'],
	],
	clipboard: { matchVisual: false },
	imageResize: {
		displayStyles: { backgroundColor: 'black', border: 'none', color: 'white' },
		modules: ['Resize', 'DisplaySize', 'Toolbar'],
	},
};

// Register ImageResize module
ReactQuill.Quill.register('modules/imageResize', ImageResize);

export default function UmmrahList({ data, onDelete, onUpdate, mainCities = [] }) {
	const [isModalOpen, setModalOpen] = useState(false);
	const [text, setText] = useState('');
	const [selectedLocation, setSelectedLocation] = useState('');
	const [imagePreview, setImagePreview] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [title, setTitle] = useState('');
	const [id, setId] = useState(null);
	const [loading, setLoading] = useState(false);

	// Handle edit button click
	const handleEditClick = (post) => {
		setId(post.id);
		setTitle(post.title);
		setText(post.description);
		setImagePreview(post.image);
		setSelectedLocation(post.location?.id || '');
		setModalOpen(true);
	};

	// Handle image file change
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => setImagePreview(reader.result);
			reader.readAsDataURL(file);
			setImageFile(file);
		}
	};

	// Get CSRF token from cookies
	const getCSRFToken = () => {
		return document.cookie
			.split(';')
			.find((cookie) => cookie.trim().startsWith('csrftoken='))
			?.split('=')[1];
	};

	// Update Ummrah post
	const handleUpdate = async () => {
		if (!imagePreview || !text || !title || !selectedLocation) {
			alert('Please fill in all fields.');
			return;
		}

		setLoading(true);
		const formData = new FormData();
		formData.append('location_id', selectedLocation);
		formData.append('title', title);
		if (imageFile) {
			formData.append('image', imageFile);
		}
		formData.append('description', text);

		try {
			const response = await axiosInstance.put(`/mainapp/ummrah/${id}/`, formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					'X-CSRFToken': getCSRFToken(),
					'Content-Type': 'multipart/form-data',
				},
			});
			alert('Ummrah post updated successfully!');
			setModalOpen(false);
			onUpdate?.(response.data); // Notify parent component of update
		} catch (error) {
			console.error('Error updating Ummrah post:', error);
			alert('Error updating Ummrah post.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-4 sm:p-6">
			{/* Header */}
			<h2 className="text-xl sm:text-2xl font-bold mb-4">Ummrah Post List</h2>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="min-w-full border-collapse border text-left text-sm">
					<thead className="bg-gray-100">
						<tr className="border-b">
							<th className="p-3 font-semibold">Image</th>
							<th className="p-3 font-semibold">Title</th>
							<th className="p-3 font-semibold">Description</th>
							<th className="p-3 font-semibold">Action</th>
						</tr>
					</thead>
					<tbody>
						{data.length > 0 ? (
							data.map((post, index) => (
								<tr key={index} className="border-b hover:bg-gray-50">
									<td className="p-3">
										<img
											src={post.image}
											alt="Ummrah Post"
											className="w-24 h-16 object-cover rounded"
										/>
									</td>
									<td className="p-3">{post.title}</td>
									<td
										className="p-3 max-h-20 overflow-hidden text-ellipsis"
										style={{
											display: '-webkit-box',
											WebkitLineClamp: 3,
											WebkitBoxOrient: 'vertical',
										}}
										dangerouslySetInnerHTML={{ __html: post.description }}
									/>
									<td className="p-3 flex space-x-2">
										<button
											onClick={() => handleEditClick(post)}
											className="text-blue-500 hover:text-blue-700"
										>
											<RiEditLine size={20} />
										</button>
										<button
											onClick={() => onDelete(post.id)}
											className="text-red-500 hover:text-red-700"
										>
											<RiDeleteBin6Line size={20} />
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="4" className="p-3 text-center text-gray-500">
									No Ummrah posts found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Edit Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white p-6 w-full max-w-3xl rounded-md shadow-lg max-h-[90vh] overflow-y-auto">
						<h3 className="text-xl sm:text-2xl font-bold mb-4">Edit Ummrah Post</h3>

						{/* Location Dropdown */}
						{/* <select
							value={selectedLocation}
							onChange={(e) => setSelectedLocation(e.target.value)}
							className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base mb-4"
						>
							<option value="">Select a Main City</option>
							{mainCities.map((city) => (
								<option key={city.id} value={city.id}>
									{city.name}
								</option>
							))}
						</select> */}

						{/* Title Input */}
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Write your title"
							className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base mb-4"
						/>

						{/* Image Upload */}
						<div className="flex flex-col items-center mb-4">
							<label
								htmlFor="file-upload"
								className="cursor-pointer w-full h-24 border border-gray-300 rounded-md flex flex-col items-center justify-center"
							>
								<FaUpload className="text-2xl text-gray-500 mb-2" />
								<span className="text-gray-500 text-sm">Ummrah Image</span>
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
										className="max-w-48 max-h-48 object-cover border rounded-md"
									/>
								</div>
							)}
						</div>

						{/* Description Editor */}
						<ReactQuill
							value={text}
							onChange={setText}
							modules={modules}
							theme="snow"
							className="text-sm text-gray-800 mb-4"
							placeholder="Write your description"
						/>

						{/* Save/Cancel Buttons */}
						<div className="flex justify-end mt-4">
							<button
								onClick={handleUpdate}
								disabled={loading}
								className={`px-6 py-2 bg-[#C9A038] text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''
									}`}
							>
								{loading ? 'Updating...' : 'Update'}
							</button>
							<button
								onClick={() => setModalOpen(false)}
								className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md ml-3"
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