"use strict";

const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { google } = require('googleapis');

class GoogleDriveFS {

    constructor(
        client_id, 
        project_id, 
        auth_uri, 
        token_uri, 
        auth_provider_x509_cert_url, 
        client_secret, 
        redirect_uris,
        scopes,
        tokenPath,
        auth,
        driveAPI
    ){
        this.client_id = null;
        this.project_id = null;
        this.auth_uri = null;
        this.token_uri = null;
        this.auth_provider_x509_cert_url = null;
        this.client_secret = null;
        this.redirect_uris = null;
        this.scopes = null;
        this.tokenPath = null;
        this.auth = null;
        this.driveAPI = null;
    }
    
    //public initializeApp
    initializeApp(configuration) {

        this.client_id = configuration.client_id || null;
        this.project_id = configuration.project_id || null;
        this.auth_uri = configuration.auth_uri || null;
        this.token_uri = configuration.token_uri || null;
        this.auth_provider_x509_cert_url = configuration.auth_provider_x509_cert_url || null;
        this.client_secret = configuration.client_secret || null;
        this.redirect_uris = configuration.redirect_uris || null;
        this.scopes = configuration.scopes || ['https://www.googleapis.com/auth/drive'];
        this.tokenPath = configuration.tokenPath || './token.json';
        this.auth = null;
        this.driveAPI = null;

        this.authorize({
            client_id: this.client_id,
            client_secret: this.client_secret,
            redirect_uris: this.redirect_uris
        }, auth => {
            this.setAuth(auth)
            const caralho = this.auth;


            const drive = google.drive({version: 'v3', caralho});

        var fileMetadata = {
            'name': 'teste_api',
            'mimeType': 'application/vnd.google-apps.folder'
        };
        drive.files.create({
            resource: fileMetadata,
            fields: 'id'
        }, function (err, file) {
            if (err) {
                // Handle error
                console.error(err);
            } else {
                console.log('Folder Id: ', file.id);
            }
        });
        });

    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    async authorize(credentials, callback) {
        const {client_secret, client_id, redirect_uris} = credentials;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris);
    
        // Check if we have previously stored a token.
        fs.readFile(this.tokenPath, (err, token) => {
            if (err) return this.getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    getAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.scopes,
        });

        console.log('Authorize this app by visiting this url:', authUrl);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question('Enter the code from that page here: ', (code) => {

            rl.close();

            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(this.tokenPath, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', this.tokenPath);
                });
                callback(oAuth2Client);
            });
        });
    }

    setScope(scope) {
        this.scopes.push(scope);
    }

    setAuth(auth) {
        this.auth = auth;
    }

    mkdir(folderName) {

        const tt = this.auth;

        const drive = google.drive({version: 'v3', tt});

        var fileMetadata = {
            'name': folderName,
            'mimeType': 'application/vnd.google-apps.folder'
        };
        drive.files.create({
            resource: fileMetadata,
            fields: 'id'
        }, function (err, file) {
            if (err) {
                // Handle error
                console.error(err);
            } else {
                console.log('Folder Id: ', file.id);
            }
        });
    }

}

module.exports = GoogleDriveFS;