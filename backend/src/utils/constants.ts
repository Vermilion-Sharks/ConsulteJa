import FormatUtils from "./format";

export const JWT_SECRET = process.env.JWT_SECRET!;
export const IS_PRODUCTION = process.env.NODE_ENV?.toLowerCase() === 'production';
export const SESSION_MS_WITH_REMEMBER = 
    FormatUtils.getMilisecondsByText(process.env.SESSION_TIME_WITH_REMEMBER || '30d');
export const SESSION_MS_WITHOUT_REMEMBER = 
    FormatUtils.getMilisecondsByText(process.env.SESSION_TIME_WITHOUT_REMEMBER || '2h');
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;