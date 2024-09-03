import * as msal from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "1a145faa-8512-42f0-9093-8eeac38b3dcd",
    authority: "https://login.microsoftonline.com/39016543-378f-4dc5-b626-832db78c9f85",
    redirectUri: "https://gottalent.scoutwired.org/auth-redirect",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["user.read"]
};

export const msalInstance = new msal.PublicClientApplication(msalConfig);

// Account selection logic is app dependent. Adjust as needed for different use cases.
// Set active acccount on page load
const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

msalInstance.addEventCallback((event) => {
  // set active account after redirect
  if (event.eventType === msal.EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
  }
}, error=>{
  console.log('error', error);
});

console.log('get active account', msalInstance.getActiveAccount());

// handle auth redired/do all initial setup for msal
msalInstance.handleRedirectPromise().then(authResult=>{
  // Check if user signed in 
  const account = msalInstance.getActiveAccount();
  if(!account){
    // redirect anonymous user to login page 
    msalInstance.loginRedirect();
  }
}).catch(err=>{
  // TODO: Handle errors
  console.log(err);
});