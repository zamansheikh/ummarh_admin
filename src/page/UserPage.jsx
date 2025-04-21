import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Sidebar from '../component/Sidebar';
import { RiDeleteBin6Line } from 'react-icons/ri';
import ProfileModal from '../component/ProfileModal';
import axiosInstance from '../component/axiosInstance';

export default function UserPage() {
	const [search, setSearch] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [data, setData] = useState([]);
	const [users, setUser] = useState();
	const [selectedData, setSelectData] = useState({});

	const [activeTab, setActive] = useState('guide');

	const fetchChats = async () => {
		try {
			const response = await axiosInstance.get('/auth/all-users/');

			if (response.status === 200) {
				console.log('✅ user List Fetched 33:', response.data);
				setData(response.data);
			} else {
				console.error('❌ Error fetching user list:', response.data.error);
			}
		} catch (error) {
			console.error('❌ Error fetching user list:', error.message);
		}
	};

	useEffect(() => {
		if (activeTab === 'guide') {
			setUser(data.guides);
		} else {
			setUser(data.tourists);
		}
	}, [activeTab, data.guides, data.tourists]);

	useEffect(() => {
		fetchChats();
	}, []);

	const filteredUsers = users?.filter((user) =>
		user.name.toLowerCase().includes(search.toLowerCase())
	);

	const handleDelete = async (id) => {
		try {
			const confirmation = window.confirm('Are you Sure delete this user');
			if (!confirmation) {
				return;
			}
			const response = await axiosInstance.delete(`/auth/delete-users/${id}/`);
			if (response.status === 204) {
				alert('User Deleted Sucessfully');
				fetchChats();
			}
		} catch (error) {
			console.error('Error deleting User:', error);
		}
	};

	return (
		<Sidebar>
			<div className="md:pr-3 px-5">
				{/* Header */}
				<div className="flex justify-start items-center gap-3 mb-4 border-b">
					<button
						onClick={() => setActive('guide')}
						className={
							activeTab === 'guide'
								? ' text-[#C9A038] border-b-2 border-b-[#C9A038]'
								: ''
						}>
						Guide
					</button>
					<button
						onClick={() => setActive('tourist')}
						className={
							activeTab === 'tourist'
								? 'text-[#C9A038] border-b-2 border-b-[#C9A038]'
								: ''
						}>
						Tourist
					</button>
				</div>

				{/* Search and Sort */}
				<div className="flex justify-between w-full items-center mb-4">
					<p className="text-center text-xl">
						{activeTab === 'guide' ? 'Guide' : 'Tourist'}
					</p>
					<div className="flex items-center gap-4 w-full justify-end ">
						<div className="flex border rounded-md overflow-hidden md:w-1/5 pl-2">
							<button className="">
								<FaSearch color="#7E7E7E" />
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
				{activeTab === 'guide' ? (
					<div className="overflow-x-auto">
						<table className="w-full border-collapse border text-left">
							<thead>
								<tr className="border-b">
									<th className="p-2">Users Name</th>
									<th className="p-2">Phone Number</th>
									<th className="p-2">Email</th>
									<th className="p-2">Address</th>
									<th className="p-2">Status</th>
									<th className="p-2">Action</th>
								</tr>
							</thead>
							<tbody>
								{filteredUsers?.map((user, index) => (
									<tr key={index} className="border-b">
										<td
											onClick={() => {
												setModalVisible(true);
												setSelectData(user);
											}}
											className="p-2">
											{user.name}
										</td>
										<td
											onClick={() => {
												setModalVisible(true);
												setSelectData(user);
											}}
											className="p-2">
											{user.phone_number}
										</td>
										<td
											onClick={() => {
												setModalVisible(true);
												setSelectData(user);
											}}
											className="p-2">
											{user.user.email}
										</td>
										<td
											onClick={() => {
												setModalVisible(true);
												setSelectData(user);
											}}
											className="p-2">
											{user.address}
										</td>
										<td
											onClick={() => {
												setModalVisible(true);
												setSelectData(user);
											}}
											className="p-2">
											<span
												className={`px-2 py-1 rounded-md text-sm ${
													user.guide_status == true
														? 'bg-green-100 text-green-600'
														: 'bg-red-100 text-red-600'
												}`}>
												{user.guide_status == true ? 'Active' : 'Inactive'}
											</span>
										</td>
										<td className="p-2">
											<RiDeleteBin6Line
												size={18}
												onClick={() => handleDelete(user.user.id)}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full border-collapse border text-left">
							<thead>
								<tr className="border-b">
									<th className="p-2">Users Name</th>

									<th className="p-2">Phone Number</th>
									<th className="p-2">Email</th>
									<th className="p-2">Address</th>

									<th className="p-2">Action</th>
								</tr>
							</thead>
							<tbody>
								{filteredUsers?.map((user, index) => (
									<tr key={index} className="border-b">
										<td className="p-2">{user.name}</td>

										<td className="p-2">{user.phone_number}</td>
										<td className="p-2">{user.user.email}</td>
										<td className="p-2">{user.address}</td>

										<td className="p-2">
											<RiDeleteBin6Line
												size={18}
												onClick={() => handleDelete(user.user.id)}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
				{/* User Table */}
				<ProfileModal
					data={selectedData}
					visible={modalVisible}
					onClose={() => setModalVisible(false)}
				/>
			</div>
		</Sidebar>
	);
}
