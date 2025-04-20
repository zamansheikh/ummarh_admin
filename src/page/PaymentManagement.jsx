import React, { useEffect, useState } from 'react';
import { FaSearch, FaSort } from 'react-icons/fa';
import Sidebar from '../component/Sidebar';
import { RiDeleteBin6Line } from 'react-icons/ri';
import axiosInstance from '../component/axiosInstance';

// const payments = [
//   { guideName: "Abu Zayd", touristName: "Rakib", serviceName: "City Tour", price: "$100", payablePrice: "$90", status: "Ongoing", cardNumber: "**** **** **** 1234", billing: "Paid" },
//   { guideName: "Hafiz Faizan", touristName: "Karim", serviceName: "Hiking", price: "$150", payablePrice: "$140", status: "Completed", cardNumber: "**** **** **** 5678", billing: "Pending" },
//   { guideName: "Asim Khan", touristName: "Mecca", serviceName: "Religious Tour", price: "$200", payablePrice: "$180", status: "Ongoing", cardNumber: "**** **** **** 9012", billing: "Paid" },
//   { guideName: "Ali Olomi", touristName: "Mecca", serviceName: "Safari", price: "$250", payablePrice: "$230", status: "Completed", cardNumber: "**** **** **** 3456", billing: "Paid" }
// ];

export default function PaymentManagement() {
	const [search, setSearch] = useState('');
	const [sortBy, setSortBy] = useState('Newest');
	const [TransactionsData, setTransactionData] = useState([]);
	const token = localStorage.getItem('authToken');

	const filteredPayments = TransactionsData.filter((payment) =>
		payment?.guide?.name.toLowerCase().includes(search.toLowerCase())
	);
	const fetchDashbordData = async () => {
		try {
			const response = await axiosInstance.get('/mainapp/transactions/all/', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setTransactionData(response.data);
			console.log('f', response.data);
		} catch (error) {
			console.error('Error fetching subscriptions data:', error);
		}
	};

	useEffect(() => {
		fetchDashbordData();
	}, []);

	const formatTimestamp = (isoTimestamp) => {
		const date = new Date(isoTimestamp);

		// Format date
		const day = date.getDate();
		const month = date.toLocaleString('en-US', { month: 'short' }); // May
		const year = date.getFullYear().toString().slice(-2); // 24
		const hours = date.getHours() % 12 || 12; // 12-hour format
		const ampm = date.getHours() >= 12 ? 'PM' : 'AM'; // AM/PM

		return `${day} ${month} ${year}, ${hours} ${ampm}`;
	};

	return (
		<Sidebar title={'Payment Management'}>
			<div className="md:pr-3 px-5">
				<div className="flex justify-between w-full items-center mb-4">
					<p className="text-center text-xl">Payment</p>
					<div className="flex items-center gap-4 w-full justify-end ">
						<div className="flex border rounded-md overflow-hidden md:w-1/5 pl-2">
							<button>
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

				<div className="overflow-x-auto">
					<table className="w-full md:text-base text-sm border-collapse border text-left">
						<thead>
							<tr className="border-b">
								<th className="p-2">Serial No</th>
								<th className="p-2">Guide Name</th>
								<th className="p-2">Tourist Name</th>
								<th className="p-2">Service Name</th>
								<th className="p-2">Price</th>
								<th className="p-2">Payable Price</th>
								<th className="p-2">Status</th>
								<th className="p-2">Create At</th>
								<th className="p-2">Card Number</th>
								<th className="p-2">Billing</th>
							</tr>
						</thead>
						<tbody>
							{filteredPayments.map((payment, index) => (
								<tr key={index} className="border-b">
									<td className="p-2">{index + 1}</td>
									<td className="p-2">{payment.guide?.name}</td>
									<td className="p-2">{payment.user?.name}</td>
									<td className="p-2">
										{' '}
										{Array.isArray(payment.services)
											? payment.services
													.map((loc) => loc.location.location_name)
													.join(', ')
											: 'unknownLocation'}
									</td>
									<td className="p-2">{payment.total_amount}</td>
									<td className="p-2">
										{Math.round(payment.total_amount * 0.8)}
									</td>
									<td className="p-2">
										<span
											className={`px-2 py-1 rounded-md text-sm ${
												payment.status === 'Complete'
													? 'bg-green-100 text-green-600'
													: 'bg-red-100 text-red-600'
											}`}>
											{payment.status}
										</span>
									</td>
									<td className="p-2">{formatTimestamp(payment.created_at)}</td>
									<td className="p-2">{payment.guide?.guide_card_number}</td>
									<td className="p-2">
										{payment.status === 'Complete' ? (
											<button className="px-3 py-1 rounded text-sm bg-[#2E8B57] text-white">
												Send
											</button>
										) : (
											<button className="px-3 py-1 rounded text-sm border border-[#2E8B57]">
												Send
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</Sidebar>
	);
}
