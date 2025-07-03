import { useEffect, useState } from 'react';
import { FaUpload } from 'react-icons/fa'; // Import upload icon
import Sidebar from '../component/Sidebar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import ImageResize from 'quill-image-resize-module-react';
import BlogList from './BlogList';
import axiosInstance from '../component/axiosInstance';

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
		['link', 'image', 'video'], // Enable image & video upload
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

// Register the ImageResize module
ReactQuill.Quill.register('modules/imageResize', ImageResize);

export default function Blog() {
	const [text, setText] = useState('');
	const [activeTab, setActive] = useState('upload');
	const [location, setLocation] = useState([]);
	const [data, setData] = useState([]);
	const [selectedLocation, setSelectedLocation] = useState('');
	const [selected, setSelected] = useState('');
	const [imagePreview, setImagePreview] = useState(null); // State to hold the image preview
	const [imageFile, setImageFile] = useState(null); // State for holding the image file for upload
	const [title, setTitle] = useState('');

	const [blogData, setBlogData] = useState('');

	useEffect(() => {
		fetchMainCities();
		fetchCities();
		fetchBlog();
	}, []);

	const fetchMainCities = async () => {
		try {
			const response = await axiosInstance.get('/mainapp/main-cities/');
			setData(response.data);
		} catch (error) {
			console.error('Error fetching Main Cities:', error);
		}
	};

	const fetchCities = async () => {
		try {
			const response = await axiosInstance.get('/mainapp/locations/');
			setLocation(response.data);
			console.log(response.data);
		} catch (error) {
			console.error('Error fetching Cities:', error);
		}
	};
	const fetchBlog = async () => {
		try {
			const response = await axiosInstance.get('/mainapp/blogs/');
			setBlogData(response.data);
			console.log(response.data);
		} catch (error) {
			console.error('Error fetching Cities:', error);
		}
	};

	const handleDelete = async (id) => {
		try {
			const response = await axiosInstance.delete(`/mainapp/blogs/${id}/`);
			if (response.status === 204) {
				alert('Blog Deleted Sucessfully');
				fetchBlog();
			}
		} catch (error) {
			console.error('Error fetching Cities:', error);
		}
	};

	// Handle the file input change and preview the selected image
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
	const getCSRFToken = () => {
		return document.cookie
			.split(';')
			.find((cookie) => cookie.trim().startsWith('csrftoken='))
			?.split('=')[1];
	};
	// Save function to send data to backend
	const saveBlog = async () => {
		if (!selected || !imageFile || !text || !title) {
			alert('Please fill in all fields.');
			return;
		}
		const csrfToken = getCSRFToken();
		console.log('selectedLocation', selectedLocation);

		const formData = new FormData();
		formData.append('location_id', selected);
		formData.append('title', title); // Title from the input
		formData.append('image', imageFile); // Image file
		formData.append('description', text); // Description from the editor
		const token = localStorage.getItem('authToken');
		try {
			const response = await axiosInstance.post('/mainapp/blogs/', formData, {
				headers: {
					'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
					Authorization: ` Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			});
			console.log('Blog saved successfully:', response.data);
			alert('Blog saved successfully!');
			// You can reset the fields after successful save
			setText('');
			setImagePreview(null);
			setSelectedLocation('');
			setImageFile(null);
			fetchBlog();
		} catch (error) {
			console.error('Error saving blog:', error);
			alert('Error saving blog.');
		}
	};

	return (
		<Sidebar title={'Blog'}>
			<div className="px-3">
				{/* Header */}
				<div className="flex justify-start items-center gap-3 mb-4 border-b">
					<button
						onClick={() => setActive('upload')}
						className={
							activeTab === 'upload'
								? ' text-[#C9A038] border-b-2 border-b-[#C9A038]'
								: ''
						}>
						Upload
					</button>
					<button
						onClick={() => setActive('list')}
						className={
							activeTab === 'list'
								? 'text-[#C9A038] border-b-2 border-b-[#C9A038]'
								: ''
						}>
						List
					</button>
				</div>
				<div className="w-full flex flex-col justify-center items-center">
					{/* User Table */}
					{activeTab === 'upload' ? (
						<div className="flex flex-col gap-5 px-4 md:w-[60vw] w-[80vw]">
							<div className="flex gap-5">
								<select
									onChange={(e) => setSelected(e.target.value)}
									className="w-full pl-2 h-[5vh] border rounded-md">
									<option value="">Select A Main City</option>
									{data.map((item, index) => (
										<option key={index} value={item.id}>
											{item.name}
										</option>
									))}
								</select>
							</div>

							{/* Title Input */}
							<div className="">
								<input
									id="blog-title"
									type="text"
									onChange={(e) => setTitle(e.target.value)}
									placeholder="Write your title"
									className="w-full pl-2 h-[5vh] border border-gray-[rgba(34, 34, 34, 0.49)] rounded-md"
								/>
							</div>

							{/* Blog Image Upload Section with Icon */}
							<div className="flex flex-col items-center">
								<label
									htmlFor="file-upload"
									className="cursor-pointer w-full h-[12vh] border border-gray-[rgba(34, 34, 34, 0.49)] rounded-md text-center flex flex-col items-center justify-center">
									<FaUpload className="text-4xl text-gray-500 mb-2" />{' '}
									{/* Upload icon */}
									<span className="text-gray-500">Blog Image</span>{' '}
									{/* Label text */}
									<input
										id="file-upload"
										type="file"
										onChange={handleImageChange} // Handle file selection
										className="hidden"
									/>
								</label>

								{/* Image Preview */}
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
							<div className="w-full bg-white rounded-lg ">
								<ReactQuill
									value={text}
									onChange={setText}
									theme="snow"
									modules={modules} // Enable toolbar with image upload
									className="text-sm w-full text-gray-800 md:h-[40vh] h-[300px]"
									placeholder="Write your description"
								/>
							</div>

							{/* Save Button */}
							<div className="mt-12 md:flex items-end justify-end mr-3 absolute md:w-auto  bottom-10 w-full">
								<button
									onClick={saveBlog}
									className="px-10 rounded-md py-2 bg-[#C9A038] ">
									Save
								</button>
							</div>
						</div>
					) : (
						<BlogList
							fetchBlog={fetchBlog}
							data={blogData}
							onDelete={handleDelete}
						/>
					)}
				</div>
			</div>
		</Sidebar>
	);
}
