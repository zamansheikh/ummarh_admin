import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://admin.nusukey-omra.com/api',
});

export default axiosInstance;
