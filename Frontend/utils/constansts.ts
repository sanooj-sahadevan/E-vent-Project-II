export const PayU = {
    merchantKey: 'PMd9OW',
  };
  
  //  /* PROD: =
  export const FRONTEND_DOMAIN = "http://localhost:3000";
  
  const DOMAIN = "http://localhost:3000";
  
  const USER_SERVICE_DOMAIN = DOMAIN;
  const POSTS_SERVICE_DOMAIN = DOMAIN;
  const MESSAGE_SERVICE_DOMAIN = DOMAIN;
  const NOTIFICATION_SERVICE_DOMAIN = DOMAIN;
  export const PAYMENT_SERVICE_DOMAIN = DOMAIN;

  
  export const USER_SERVICE_URL = `${USER_SERVICE_DOMAIN}/api/user-service`;
  export const POSTS_SERVICE_URL = `${POSTS_SERVICE_DOMAIN}/api/posts-service`;
  export const MESSAGE_SERVICE_URL = `${MESSAGE_SERVICE_DOMAIN}/api/message-service`;
  export const NOTIFICATION_SERVICE_URL = `${NOTIFICATION_SERVICE_DOMAIN}/api/notification-service`;
  export const ADS_SERVICE_URL = `${PAYMENT_SERVICE_DOMAIN}/api/ads-service`;
  
  export const SOCKET_URI = "http://localhost:3000";
  
  
  export const JWT_SECRET =process.env.JWT_SECRET