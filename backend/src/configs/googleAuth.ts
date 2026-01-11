import { GOOGLE_CLIENT_ID } from '@utils/constants';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)

export default googleClient;