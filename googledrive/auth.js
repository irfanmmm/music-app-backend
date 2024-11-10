const { google } = require("googleapis");
const { META_IMAGE } = require("./filepath");

const SCOPES = [
  // "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive",
];
const KEYFILEPATH = "./googledrive/client_secret.json"; // Update with your client secret path

function authenticate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });
  return auth;
}

async function setFilePublic(fileId) {
  const auth = authenticate();
  const drive = google.drive({ version: "v3", auth });

  try {
    const permission = {
      type: "user",
      role: "writer",
      emailAddress: "koyarabigh890@gmail.com",
    };

    await drive.permissions.create({
      fileId: fileId,
      requestBody: permission,
      // transferOwnership: true,
      // moveToNewOwnersRoot: true,
      // fields: "id",
    });

    console.log(
      `Ownership successfully transferred to ${permission.emailAddress}`
    );
    // await drive.permissions.create({
    //   fileId: fileId,

    //   requestBody: {
    //     role: "owner",
    //     type: "user",
    //     emailAddress:
    //       "koyarabigh890-gmail-com@musicapplication-9bc3e.iam.gserviceaccount.com",
    //   },
    //   transferOwnership: true,
    // });
    // console.log("File set to public");
  } catch (error) {
    console.error("Error setting file permissions:", error);
    throw error;
  }
}

async function getFileUrl(fileId) {
  const auth = authenticate();
  // await setFilePublic(fileId);
  const drive = google.drive({ version: "v3", auth });

  try {
    const response = await drive.files.list({
      q: `'${fileId}' in parents`,
      fields: "files(id, name, webViewLink, webContentLink)",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching file URL:", error);
    throw error;
  }
}

async function getsingleFileUrl(id) {
  const auth = authenticate();
  // await setFilePublic(id);
  const drive = google.drive({ version: "v3", auth });
  try {
    const response = await drive.files.get({
      fileId: id,
      fields: "webViewLink, webContentLink", // Requesting the direct download and view links
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function onDeleteToDrive(songId) {
  const auth = authenticate();
  const drive = google.drive({ version: "v3", auth });

  try {
    // Optionally check file metadata to confirm ownership
    const fileMetadata = await drive.files.get({
      fileId: songId,
      fields: "owners",
    });

    const isOwner = fileMetadata.data.owners.some(
      (owner) => owner.emailAddress === "koyarabigh890@gmail.com"
    );

    if (!isOwner) {
      console.error("Error: Authenticated user is not the file owner.");
      return;
    }
    await setFilePublic(songId);

    // Delete the file directly
    await drive.files.delete({
      fileId: songId,
      supportsAllDrives: true,
    });

    console.log("Successfully Deleted");
  } catch (error) {
    console.error(
      "Error deleting file:",
      error.response ? error.response.data : error
    );
  }
}

async function uploadImageFile(filename, buffer) {
  const auth = authenticate();
  const drive = google.drive({ version: "v3", auth });
  try {
    const response = await drive.files.create({
      requestBody: {
        name: filename, // File name in Google Drive
        mimeType: "image/jpeg", // Adjust based on actual image type
        parents: [META_IMAGE], // Specify the folder ID where the file should be uploaded
      },
      media: {
        mimeType: "image/jpeg",
        body: buffer,
      },
    });
    return response.data; // This contains the file ID and other details
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

// Example usage after uploading a song

module.exports = {
  getFileUrl,
  uploadImageFile,
  getsingleFileUrl,
  onDeleteToDrive,
};
