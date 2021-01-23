const gdfs = require('./index');

const fs = new gdfs();

fs.initializeApp({
    "client_id":"472526498126-9hl63cuisirq1fjitpu942qkihci3tuk.apps.googleusercontent.com",
    "project_id":"quickstart-1585598195903",
    "auth_uri":"https://accounts.google.com/o/oauth2/auth",
    "token_uri":"https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
    "client_secret":"rQ87hUWnx4HlRD_OoWJP-7Uk",
    "redirect_uris":["http://localhost"],
    "scopes": ['https://www.googleapis.com/auth/drive']
});