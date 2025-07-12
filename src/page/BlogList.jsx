/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { RiDeleteBin6Line, RiEditLine } from 'react-icons/ri';
import ReactQuill from 'react-quill';
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
	clipboard: {
		matchVisual: false,
	},
	imageResize: {
		displayStyles: {
			backgroundColor: 'black',
			border: 'none',
			color: 'white',
		},
		modules: ['Resize', 'DisplaySize', 'Toolbar'],
	},
};

// Register ImageResize module
ReactQuill.Quill.register('modules/imageResize', ImageResize);

export default function BlogList() {
	const [isModalOpen, setModalOpen] = useState(false);
	const [text, setText] = useState('');
	const [selectedLocation, setSelectedLocation] = useState('');
	const [imagePreview, setImagePreview] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [title, setTitle] = useState('');
	const [id, setId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);

	const fetchBlog = async () => {
		setLoading(true);
		try {
			const response = await axiosInstance.get('/mainapp/blogs/');
			setData(response.data);
			setLoading(false);
			console.log(response.data);
		} catch (error) {
			console.error('Error fetching Blogs:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBlog();
	}, []);

	const handleUpdate = async () => {
		setLoading(true);
		try {
			if (!imagePreview || !text || !title) {
				alert('Please fill in all fields.');
				return;
			}

			const formData = new FormData();
			formData.append('location_id', selectedLocation);
			formData.append('title', title);
			if (imageFile) {
				formData.append('image', imageFile);
			}
			formData.append('description', text);
			const token = localStorage.getItem('authToken');
			const response = await axiosInstance.put(
				`/mainapp/blogs/${id}/`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			if (response.status === 200) {
				setModalOpen(false);
				alert('Blog Updated Successfully');
				fetchBlog();
			}
		} catch (error) {
			console.error('Error updating Blog:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this blog?')) {
			return; // Exit if the user cancels the deletion
		}

		try {
			await axiosInstance.delete(`/mainapp/blogs/${id}/`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
			alert('Blog deleted successfully!');

			setData(data.filter((blog) => blog.id !== id));
		} catch (error) {
			console.error('Error deleting blog:', error);
			alert('Error deleting blog.');
		}
	};

	const handleEditClick = (post) => {
		setSelectedLocation(post.location?.id);
		setId(post.id);
		setTitle(post.title);
		setText(post.description);
		setImagePreview(post.image);
		setModalOpen(true);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
			setImageFile(file);
		}
	};

	return (
		<div className=" w-full">
			<h2 className="text-2xl font-bold mb-4">Blog List</h2>

			{/* Loading State */}
			{loading ? (
				<div className="flex flex-col justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A038]"></div>
					<span className="ml-3 mt-1 text-lg ">Loading...</span>
				</div>
			) : (
				<>
					{/* Blog Table */}
					<div className="overflow-x-auto w-full">
						<table className="min-w-full border-collapse border text-left text-sm">
							<thead className="bg-gray-100">
								<tr className="border-b">
									<th className="p-3 font-semibold">Image</th>
									<th className="p-3 font-semibold">Blog Title</th>
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
													alt="Blog"
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
													className="text-red-500 hover:text-red-700"
													onClick={() => handleDelete(post.id)}
												>
													<RiDeleteBin6Line size={20} />
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="4" className="p-3 text-center text-gray-500">
											No blogs found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</>
			)}

			{/* Edit Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white p-6 w-full max-w-3xl rounded-md shadow-lg max-h-[90vh] overflow-y-auto">
						<h3 className="text-2xl font-bold mb-4">Edit Blog</h3>

						{/* Title Input */}
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Write your title"
							className="w-full p-2 h-10 border border-gray-300 rounded-md mb-4"
						/>

						{/* Blog Image Upload Section */}
						<div className="flex flex-col items-center mb-4">
							<label
								htmlFor="file-upload"
								className="cursor-pointer w-full h-24 border border-gray-300 rounded-md text-center flex flex-col items-center justify-center"
							>
								<FaUpload className="text-2xl text-gray-500 mb-2" />
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
							className="text-sm text-gray-800  mb-4"
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