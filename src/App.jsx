import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Login from './authentication/Login';
import Home from './page/Home';
import './App.css';
import TermsAndConditions from './page/TermsConditions';
import PrivacyPolicy from './page/PrivacyPolicy';
import { useAuth } from './component/AuthContext';
import NotFound from './page/NotFound';
import UserPage from './page/UserPage';
import Blog from './page/Blog';
import PlacesList from './page/PlacesList';
import PaymentManagement from './page/PaymentManagement';
import HelpSupport from './page/HelpSupport';
import ReplyMessages from './page/ReplyMessages';
import Ummrah from './page/Ummrah';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />

				<Route path="/" element={<ProtectedRoute component={<Home />} />} />
				<Route
					path="/user"
					element={<ProtectedRoute component={<UserPage />} />}
				/>
				<Route path="/blog" element={<ProtectedRoute component={<Blog />} />} />
				<Route
					path="/add_place"
					element={<ProtectedRoute component={<PlacesList />} />}
				/>
				<Route
					path="/payment-management"
					element={<ProtectedRoute component={<PaymentManagement />} />}
				/>
				<Route
					path="/terms-conditions"
					element={<ProtectedRoute component={<TermsAndConditions />} />}
				/>
				<Route
					path="/privacy-policy"
					element={<ProtectedRoute component={<PrivacyPolicy />} />}
				/>
				<Route
					path="/help-support"
					element={<ProtectedRoute component={<HelpSupport />} />}
				/>
				<Route
					path="/reply-message"
					element={<ProtectedRoute component={<ReplyMessages />} />}
				/>
				<Route
					path="/ummrah"
					element={<ProtectedRoute component={<Ummrah />} />}
				/>

				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};

const ProtectedRoute = ({ component }) => {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? component : <Navigate to="/login" replace />;
};

export default App;
