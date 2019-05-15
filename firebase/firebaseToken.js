module.exports = {
    "type": "service_account",
    "project_id": process.env.FB_PROJECT_ID,
    "private_key_id": process.env.FB_PRIVATE_KEY_ID, 
    "private_key":  `-----BEGIN PRIVATE KEY-----\n${process.env.FB_PRIVATE_KEY.replace('jjjj', '\\').replace(/\\n/g, '\n')}\n-----END PRIVATE KEY-----\n`,
    "client_email": process.env.FB_CLIENT_EMAIL,
    "client_id": process.env.FB_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.FB_CERT_URL
  }


