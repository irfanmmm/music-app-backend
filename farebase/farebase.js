const admin = require("firebase-admin");

const path = require("path");

const serviceaccount = {
  type: "service_account",
  project_id: "musicapplication-9bc3e",
  private_key_id: "ab352e37e77a63513b62b93bf72963016172cb56",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCeuE/lD5Tj2f7B\n0L4fpxGkNvUIR2WnnhWBYALh1NecREgVXUiJ4Pt1eMbuukossjRIKiYTeH3oVXSC\nqKPDSCVIzhQ7p9EyDYYab+MqVPDb2mUeCRZwGSdpCK8ttVgQNEiTdnR/+Tl+vyGw\nnL8EIjb606i41NSImCj3P2UyWcoJhzRKabrFHf55rOZJNKrplCBxEFDyYAcwJATQ\nWNCQYBL6LlsuTQ7JQxmeO7Rdqht5acShMmh5rQjorZNiTpXp3NZVduSwisUNJTBI\nuSsGpUDjWAH02ogCqZW4iXQsTuiDvyT4F51IN9wQYoCywRDopLmpO0Dq0kwqO3L3\nAcBF2vr7AgMBAAECggEAQfyRpsMsHPCAJDbzHDi6smFwzMDWJ/ImsbNnb1ksTJjs\nuQkfw8bn9EZCunRzqxJpfwka7GRfQCzq8/lFoEYJzjNzIPwbkmoh8zLKKErJGjY5\nbNvNWsxyYI4OOnwWwSHjfH82XxAP0byHtqPsHD1XSz+c+T7un11XRreyDFVdFElc\niGlSu/Ufgz4dtwXEEAuCZxFm2L/SqoiKUrHiMb+mmKXYkzH8Hd6m8jed1XzyNntW\ndgPPDeqDB/ecvwUEQ/yqm/nL5E2xu/ylqnF77p7nMvDWIXQwnw+4rrwBzdXSWrh1\n8TRxsUVvsFH5pqOe9NyOkeFZIzvjDt5qm3keZnHLQQKBgQDQBjH20l0K39wsdE++\nmtJMl8BH+C8WfW/Hl88v6xR2CLSPGI62Sa0JEdqpM1GTJXmRmZRMrdNlXQN4Kohi\nqq9uKzdHFU/dHePqyabtzDLMFBmT39PfPEYg72iNZYfls0D368J2YAODWrcuAQ7R\nTmjC+u52FudpENuWfOR5WspROwKBgQDDUy6NM5l4mlvscx0DvgeeiqiJ51noAiXB\nMgPaQRKnL7ynqX/yJwF0XWUw+2z+lmrGtUVpmZi73KFunOXPMSGls2rQSmEYLzxy\nAfYcD3yeky1DbXgtbQI3wGhTxdYttv1vPUVt4oYIe2Z2UlFliuB4CWpiRr8y9JrI\nK1MXk89hQQKBgExvylIoT/nb8dn/zwF5gAaWyBdp0VuRMc6EMKQp2/XXEwl1e5Lt\nlYA8qDz9116bKYVfikd2o7OeLtUrw7uFfjqb9I7Q/OyBvCqceBLuskecpx1X5FEl\no5scfS1ffkTfzeKLJYQ7mW7dmWt1Bg3QotvqOk738YYApL8yGv2gZ7DbAoGAXtgy\nX5AxspVJk5wl9547tulfg28aggUg7hnqMv2sIBCXC9bLcPstwqJjM5Cy0UCa4pg8\n91UFDBvLK5n2IVCbJQnlEPU9BnBRao63QdLnUVzn+rjaRTyMeiPsxNjo8lPL5ksb\nPotjSBUboNLCAYuZCdCQnt35k7WgvxgChg1ZAsECgYAl/ZDB1rqyfpgidiS28fQg\nuJSTGuI5SWgpkHsCniFgD3qljbV5DXSD97aEQ0VKxVRHMV/x7XkDAPOrSJMDI1Ej\nxb9+jnLoQCdgNxL5lojs3A1t9rHJD2WXPC9RoLCUZg1dW19OzMAzeF/rvKwTIknR\n2FSxKC0f+lCxY1wOsFgasw==\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-mf0o9@musicapplication-9bc3e.iam.gserviceaccount.com",
  client_id: "111983157670948698045",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-mf0o9%40musicapplication-9bc3e.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceaccount),
});

module.exports = admin;
