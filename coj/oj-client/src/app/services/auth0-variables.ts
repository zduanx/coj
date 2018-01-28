interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
} 
  
export const AUTH_CONFIG: AuthConfig = {
  clientID: '0BCGS9GmjMEPSo54Jx40H4Ze2V1JbeqW',
  domain: 'apocalypse.auth0.com',
  callbackURL: window.location.origin
};