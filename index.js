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
        credentialsFilePath
    ){
        this.client_id = null;
        this.project_id = null;
        this.auth_uri = null;
        this.token_uri = null;
        this.auth_provider_x509_cert_url = null;
        this.client_secret = null;
        this.redirect_uris = null;
        this.scopes = ['https://www.googleapis.com/auth/drive'];
        this.tokenPath = 'token.json';
        this.credentialsFilePath = 'credentials.json';
    }
    
    //public initializeApp
    initializeApp(configuration) {

        switch(typeof configuration) {
            case 'object':      this.client_id = configuration.client_id || null;
                                this.project_id = configuration.project_id || null;
                                this.auth_uri = configuration.auth_uri || null;
                                this.token_uri = configuration.token_uri || null;
                                this.auth_provider_x509_cert_url = configuration.auth_provider_x509_cert_url || null;
                                this.client_secret = configuration.client_secret || null;
                                this.redirect_uris = configuration.redirect_uris || null;
                                this.scopes = configuration.scopes || null;
                                this.tokenPath = configuration.tokenPath || null;
                                this.credentialsFilePath = configuration.credentialsFilePath || null;

                                break;

            case 'string':      if(path.extname(configuration) === '.json') {
                                    //TODO: Load configuration file
                                    console.log('is a file')
                                }
                                else {
                                    throw new Error('Expected a JSON file configuration');
                                }

                                break;

            case 'undefined':   fs.readFile('./credentials.json', (err, content) => {
                                if (err) return console.log('Error loading client secret file:', err);
                                    // Authorize a client with credentials, then call the Google Drive API.
                                    //console.log(JSON.parse(content))
                                    authorize(JSON.parse(content), listFiles);
                                });

                                break;

            default:            throw new Error('Expected a object or JSON file with the Google Drive API configurations. If you don\'t set the configuration try to load a "./credentials.json" file.')
        }

        
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    authorize(credentials, callback) {
        const {client_secret, client_id, redirect_uris} = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
    
        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
        });
    }

    setScope(scope) {
        this.scopes.add(scope);
    }

    // Set vars
    setCredentials() { }
    
    setCredentialsFilePath(credentialsFilePath) {
        this.credentialsFilePath = credentialsFilePath;
    }

    setTokenFilePath(tokenFilePath) {
        this.tokenFilePath = tokenFilePath;
    }

    //private getAccessToken()
    //public setCredentiasFile
    //public setTokenFile
    //public createFolder - include Team Drive (Shared Drive)
    //public removeFolder
    //public uploadFile - insert in a folder too
    //public removeFile
    //public listFiles
    //public downloadFile
    //public shareFolderWithUser
}

module.exports = GoogleDriveFS;

// TODO: uglify the code
// TODO: apply tests
// TODO: needs documentation