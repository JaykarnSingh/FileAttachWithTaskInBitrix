






// const express = require('express');
// const multer = require('multer');
// const axios = require('axios');
// const FormData = require('form-data');
// const app = express();
// const fs = require('fs');
// const path = require('path');

// const PORT = process.env.PORT || 3000;

// // Multer
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const DOMAIN = 'me.itachyon.com';
// const ACCESS_TOKEN = 'a118fc64006328eb005d771f00000a6a584d076d234833790849327ba5836bbeefd289'; // Replace with your actual access token
// const chatId = '5944';

// // Function to get the folder ID
// async function getFolderId() {
// try {
//     const response = await axios.get(
//     `https://${DOMAIN}/rest/im.disk.folder.get?auth=${ACCESS_TOKEN}&CHAT_ID=${chatId}`
//     );


//     const folderId = response.data.result.ID;
//     // console.log("folderId " + folderId);

//     return folderId;
// } catch (error) {
//     console.error('Error getting folder ID:', error);
//     return null;
// }
// }


// // Function to get the Upload URL

// async function getUploadUrl(folderId) {
// try {
//     const response = await axios.post(
//     `https://${DOMAIN}/rest/disk.folder.uploadfile?auth=${ACCESS_TOKEN}&id=${folderId}`
//     );

//     // const uploadUrl = response.data.result.uploadUrl;
//     const uploadUrl = response.data.result.uploadUrl;
//     // console.log("upload url : " + uploadUrl)

//     return uploadUrl;
// } catch (error) {
//     console.error('Error getting Upload URL:', error);
//     return null;
// }
// }



// // Function to upload the file using Upload URL
// async function uploadFile(uploadUrl, fileData, fileName) {
// try {
//     const uniqueFileName = `${Date.now()}`;
//     const formData = new FormData();
//     formData.append('file', fileData, uniqueFileName+"_"+fileName);

//     const response = await axios.post(uploadUrl, formData, {
//     headers: formData.getHeaders(),
//     });

//     // Print the entire response object
//     console.log("Upload Response:", response.data);

//     return response.data;

// } catch (error) {
//     console.error('Error uploading file:', error);
//     return null;
// }
// }




// app.post('/upload', upload.single('file'), async (req, res) => {
// try {
  
//     if (!req.file) {
//     return res.status(400).json({ error: 'No file provided' });
//     }

//     // Step 1: Get the folder ID
//     console.log("fileData:"+req.file.originalname);
//     const folderId = await getFolderId();
//     if (!folderId) {
//     return res.status(500).json({ error: 'Unable to retrieve folder ID' });
//     }

//     // Step 2: Get the upload URL
//     const uploadUrl = await getUploadUrl(folderId, req.file.originalname);
//     if (!uploadUrl) {
//     return res.status(500).json({ error: 'Unable to get Upload URL' });
//     }
//     // console.log("upload url " +uploadUrl)

//     // Step 3: Upload the file
//     const uploadResponse = await uploadFile(uploadUrl, req.file.buffer, req.file.originalname);
//     if (!uploadResponse || !uploadResponse.result) {
//     return res.status(500).json({ error: 'File upload failed' });
//     }

//     const result = uploadResponse.result;

//     // Step 4: Commit the file
//      const commitResponse = await axios.post(`https://${DOMAIN}/rest/im.disk.file.commit?auth=${ACCESS_TOKEN}`,
//     {
//      CHAT_ID: 5944,
//      DISK_ID: result.ID,
//     }
//      )

//     if (commitResponse.data.error) {
//     console.error('Commit error:', commitResponse.data.error);
//     console.error('Error description:', commitResponse.data.error_description);
//     return res.status(500).json({
//         error: 'File commit failed',
//         error_description: commitResponse.data.error_description,
//     });
//     } else {
//     console.log(commitResponse.data);
//     res.status(200).json({
//         message: 'File uploaded and committed successfully',
//         name: result.NAME,
//         fileId: result.FILE_ID,
//         downloadUrl: result.DOWNLOAD_URL,
//         storageId: result.STORAGE_ID,
//         detailUrl: result.DETAIL_URL,
//     });
//     }


// } catch (error) {
//     // console.error('File upload or commit failed:', error);
//     res.status(500).json({ error: 'File upload or commit failed' });
// }
// });


// app.listen(PORT, () => {
// console.log(`Server is running on port ${PORT}`);
// });






const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const app = express();
const fs=require('fs');
const PORT = process.env.PORT || 3000;

// Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

const DOMAIN = 'me.itachyon.com';
const ACCESS_TOKEN = '2e0bfc64006328eb005d771f00000a6a584d072f652cebfdcbc4bcf08b885772397ec4'; // Replace with your actual access token


const TASK_ID = 6409;



// Function to get the folder ID
async function getFolderId() {
try {
    const response = await axios.get(
    // `https://${DOMAIN}/rest/disk.storage.uploadfile?auth=${ACCESS_TOKEN}&TASK_ID=${TASK_ID}`
    `https://${DOMAIN}/rest/disk.storage.getforapp?auth=${ACCESS_TOKEN}`
    );

    console.log('API Response:', response.data);

    const folderId = response.data.result.ROOT_OBJECT_ID;
    console.log(' folderId:', folderId);
    return folderId;
    
} catch (error) {
    console.error('Error getting folder ID:', error);
    return null;
}
}
getFolderId();





// Function to get the Upload URL
async function getUploadUrl(folderId, fileName) {
  try {
    const response = await axios.post(
      `https://${DOMAIN}/rest/disk.folder.uploadfile?auth=${ACCESS_TOKEN}&id=${folderId}&name=${encodeURIComponent(fileName)}`
    );

    const uploadUrl = response.data.result.uploadUrl;
    // console.log("upload url :  " + uploadUrl);
    return uploadUrl;
  } catch (error) {
    console.error('Error getting Upload URL:', error);
    return null;
  }
}

// Function to upload the file using Upload URL
async function uploadFile(uploadUrl, fileData, fileName) {
  try {
    const uniqueFileName = `${Date.now()}`;
    const formData = new FormData();
    formData.append('file', fileData, uniqueFileName+"_"+fileName);

    const response = await axios.post(uploadUrl, formData, {
      headers: formData.getHeaders(),
    });

    // console.log("Upload Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Step 1: Get the folder ID
    // const folderId = 118855;
    const folderId = await getFolderId();
    if (!folderId) {
      return res.status(500).json({ error: 'Unable to retrieve folder ID' });
    }

    // Step 2: Get the upload URL
    const uploadUrl = await getUploadUrl(folderId, req.file.originalname);
    if (!uploadUrl) {
      return res.status(500).json({ error: 'Unable to get Upload URL' });
    }

    // Step 3: Upload the file
    const uploadResponse = await uploadFile(uploadUrl, req.file.buffer,req.file.originalname);
    if (!uploadResponse || !uploadResponse.result) {
      return res.status(500).json({ error: 'File upload failed' });
    }

    const result = uploadResponse.result;
    res.status(200).json({
      message: 'File submit successfully',
      name: result.NAME,
      fileId: result.ID,
      downloadUrl: result.DOWNLOAD_URL,
      storageId: result.STORAGE_ID,
      detailUrl: result.DETAIL_URL,
    });

    const fileId = result.ID;
    console.log("file Id",fileId)

    async function attachFileToTask() {
      try {
        // Make a POST request to attach the file to the task
        const response = await axios.post(
          `https://${DOMAIN}/rest/tasks.task.files.attach?auth=${ACCESS_TOKEN}`,
          {
            taskId:TASK_ID,
            fileId:fileId,
          });
    
        if (response.data.result) {
          console.log('File attached to the task successfully.');
        } else {
          console.error('Error attaching file to task:', response.data.error_description);
        }
      } catch (error) {
        console.error('Error attaching file to task:', error);
      }
    }
    attachFileToTask();
    

  } catch (error) {
    console.error('File upload  failed:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
