/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import Sidebar from '../component/Sidebar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import axiosInstance from '../component/axiosInstance';
import UmmrahList from './UmmrahList';

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

export default function Ummrah() {
	const [text, setText] = useState('');
	const [activeTab, setActiveTab] = useState('upload');
	const [mainCities, setMainCities] = useState([]);
	const [locations, setLocations] = useState([]);
	const [ummrahData, setUmmrahData] = useState([]);
	const [selectedLocation, setSelectedLocation] = useState('');
	const [imagePreview, setImagePreview] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [title, setTitle] = useState('');
	const [loading, setLoading] = useState(false);

	// Fetch data on component mount
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const [mainCitiesRes, locationsRes, ummrahRes] = await Promise.all([
					axiosInstance.get('/mainapp/main-cities/'),
					axiosInstance.get('/mainapp/locations/'),
					axiosInstance.get('/mainapp/ummrah/'),
				]);
				setMainCities(mainCitiesRes.data);
				setLocations(locationsRes.data);
				setUmmrahData(ummrahRes.data);
			} catch (error) {
				console.error('Error fetching data:', error);
				alert('Failed to load data.');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

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

	// Save Ummrah post
	const saveBlog = async () => {
		if (!selectedLocation || !imageFile || !text || !title) {
			alert('Please fill in all fields.');
			return;
		}

		setLoading(true);
		const formData = new FormData();
		formData.append('location_id', selectedLocation);
		formData.append('title', title);
		formData.append('image', imageFile);
		formData.append('description', text);

		try {
			const response = await axiosInstance.post('/mainapp/ummrah/', formData, {
				headers: {
					'X-CSRFToken': getCSRFToken(),
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					'Content-Type': 'multipart/form-data',
				},
			});
			alert('Ummrah post saved successfully!');
			setText('');
			setImagePreview(null);
			setImageFile(null);
			setTitle('');
			setSelectedLocation('');
			setUmmrahData([...ummrahData, response.data]);
		} catch (error) {
			console.error('Error saving Ummrah post:', error);
			alert('Error saving Ummrah post.');
		} finally {
			setLoading(false);
		}
	};

	// Handle Ummrah post deletion
	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this Ummrah post?')) {
			return;
		}

		try {
			await axiosInstance.delete(`/mainapp/ummrah/${id}/`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
			alert('Ummrah post deleted successfully!');
			setUmmrahData(ummrahData.filter((post) => post.id !== id));
		} catch (error) {
			console.error('Error deleting Ummrah post:', error);
			alert('Error deleting Ummrah post.');
		}
	};

	// Handle Ummrah post update
	const handleUpdate = (updatedPost) => {
		setUmmrahData(ummrahData.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
	};

	return (
		<Sidebar title="Ummrah">
			<div className="p-4 sm:p-6">
				{/* Tabs */}
				<div className="flex justify-start items-center gap-4 mb-4 border-b border-gray-200">
					<button
						onClick={() => setActiveTab('upload')}
						className={`pb-2 text-sm sm:text-base font-medium ${activeTab === 'upload' ? 'text-[#C9A038] border-b-2 border-[#C9A038]' : 'text-gray-500'
							}`}
					>
						Upload
					</button>
					<button
						onClick={() => setActiveTab('list')}
						className={`pb-2 text-sm sm:text-base font-medium ${activeTab === 'list' ? 'text-[#C9A038] border-b-2 border-[#C9A038]' : 'text-gray-500'
							}`}
					>
						List
					</button>
				</div>

				{/* Content */}
				{loading ? (
					<div className="flex flex-col justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A038]"></div>
						<span className="mt-3 text-lg">Loading...</span>
					</div>
				) : (
					<div className="w-full">
						{activeTab === 'upload' ? (
							<div className="flex flex-col gap-4 max-w-4xl mx-auto">
								{/* Location Dropdown */}
								<select
									value={selectedLocation}
									onChange={(e) => setSelectedLocation(e.target.value)}
									className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
								>
									<option value="">Select a Main City</option>
									{mainCities.map((city) => (
										<option key={city.id} value={city.id}>
											{city.name}
										</option>
									))}
								</select>

								{/* Title Input */}
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="Write your title"
									className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
								/>

								{/* Image Upload */}
								<div className="flex flex-col items-center">
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
									className="text-sm text-gray-800 "
									placeholder="Write your description"
								/>

								{/* Save Button */}
								<div className="flex justify-end mt-4">
									<button
										onClick={saveBlog}
										disabled={loading}
										className={`px-6 py-2 bg-[#C9A038] text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''
											}`}
									>
										{loading ? 'Saving...' : 'Save'}
									</button>
								</div>
							</div>
						) : (
							<UmmrahList
								data={ummrahData}
								onDelete={handleDelete}
								onUpdate={handleUpdate}
								mainCities={mainCities}
							/>
						)}
					</div>
				)}
			</div>
		</Sidebar>
	);
}