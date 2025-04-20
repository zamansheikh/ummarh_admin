import { useEffect, useState } from 'react';
import Sidebar from '../component/Sidebar';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaPlus } from 'react-icons/fa';
import Location from '../assets/location.svg';
import axiosInstance from '../component/axiosInstance';
import { useAuth } from '../component/AuthContext';

export default function PlacesList() {
	const [places, setPlaces] = useState([]);
	const [newPlace, setNewPlace] = useState('');
	const [filterData, setFilterData] = useState([]);
	const [main_city_id, setMainCityId] = useState(null);

	const { auth } = useAuth();

	const [activeTab, setActive] = useState('Mecca');

	useEffect(() => {
		fethcLocation();
	}, []);

	const fethcLocation = async () => {
		try {
			const response = await axiosInstance.get('/mainapp/locations/');
			setPlaces(response.data);
			console.log('location', response.data);
		} catch (error) {
			console.error('Error fetching locations:', error);
		}
	};
	const handleAdd = async () => {
		if (!newPlace) {
			alert('Please add location');
			return;
		}
		try {
			const response = await axiosInstance.post(
				'/mainapp/locations/',
				{
					main_city_id,
					location_name: newPlace,
				},
				{
					headers: {
						Authorization: ` Bearer ${auth.token}`,
					},
				}
			);

			if (response.status === 201) {
				fethcLocation();
				setNewPlace('');
				alert('Location Add Succesfully');
			}
		} catch (error) {
			console.error('Error fetching locations:', error);
		}
	};

	const handleDelete = async (id) => {
		try {
			const confirmation = window.confirm('Are you sure delete this location');
			if (!confirmation) {
				return;
			}

			const response = await axiosInstance.delete(`/mainapp/locations/${id}/`, {
				headers: {
					Authorization: ` Bearer ${auth.token}`,
				},
			});

			if (response.status === 204) {
				setPlaces(places.filter((item) => item.id !== id));
				alert('Location Deleted Succesfully');
			}
		} catch (error) {
			console.error('Error fetching locations:', error);
		}
	};

	useEffect(() => {
		if (activeTab) {
			const filter = places.filter((item) => item.main_city.name === activeTab);
			setFilterData(filter);
			console.log('filter[0].main_city.id', filter[0]?.main_city.id);

			setMainCityId(filter[0]?.main_city.id);
		}
	}, [activeTab, places]);

	return (
		<Sidebar title={'Add Location'}>
			<div className="md:pr-3 px-4">
				{/* Header */}
				<div className="flex justify-start items-center gap-3 mb-4 border-b">
					<button
						onClick={() => setActive('Mecca')}
						className={
							activeTab === 'Mecca'
								? ' text-[#C9A038] border-b-2 border-b-[#C9A038]'
								: ''
						}>
						Mecca
					</button>
					<button
						onClick={() => setActive('Madina')}
						className={
							activeTab === 'Madina'
								? 'text-[#C9A038] border-b-2 border-b-[#C9A038]'
								: ''
						}>
						Madinah
					</button>
				</div>

				<h2 className="text-2xl font-bold mb-4">Places</h2>

				{/* Places List */}
				<ul className="space-y-3 ">
					{filterData.map((place, index) => (
						<li
							key={index}
							className="flex items-center justify-between  p-2 rounded-md md:w-[30%]">
							<div className="flex items-center gap-2">
								<img src={Location} alt="" />
								{place.location_name}
							</div>
							<button
								onClick={() => handleDelete(place.id)}
								className="text-red-500 hover:text-red-700">
								<RiDeleteBin6Line size={20} />
							</button>
						</li>
					))}
				</ul>

				{/* Add Location */}
				<div className="flex items-center gap-2 mt-4 border p-2 rounded-md md:w-[30%]">
					<input
						type="text"
						placeholder="Add Location"
						value={newPlace}
						onChange={(e) => setNewPlace(e.target.value)}
						className="flex-grow p-1 border-none focus:outline-none"
					/>
					<button
						onClick={handleAdd}
						className="text-green-500 hover:text-green-700">
						<FaPlus size={18} />
					</button>
				</div>

				{/* User Table */}
			</div>
		</Sidebar>
	);
}
