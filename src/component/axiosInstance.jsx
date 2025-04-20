import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://nusukey.duckdns.org/api',
});

export default axiosInstance;
