import { Google, Yahoo } from 'arctic'
import { GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_CLIENT_ID, YAHOO_OAUTH_CLIENT_ID, YAHOO_OAUTH_CLIENT_SECRET } from '$env/static/private'
import { PUBLIC_URL } from '$env/static/public'

export const googleOAuth = new Google(GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, `${PUBLIC_URL}/login/google/callback`);

export const yahooOauth = new Yahoo(YAHOO_OAUTH_CLIENT_ID, YAHOO_OAUTH_CLIENT_SECRET, `${PUBLIC_URL}/login/yahoo/callback`)