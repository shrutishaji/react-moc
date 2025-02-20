import ForgotPassword from './ForgotPage';
import authRoles from '../../auth/authRoles';

const ForgotConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: 'forgot-password',
			element: <ForgotPassword />
		}
	]
};
export default ForgotConfig;
