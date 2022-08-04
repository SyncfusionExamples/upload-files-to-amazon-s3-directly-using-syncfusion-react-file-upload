import React,{useState} from 'react';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import axios from 'axios';
import './Upload.css';

const Upload = () => {

    // State to keep the selected file
    const [selectedFile, setSelectedFile] = useState(null);

    // State to keep the upload status
    const [status, setStatus] = useState({ statusCode: 0, message: 'Ready to upload' });

    // Provide your API end point here
    const API_ENDPOINT = ""

    // Getting file details using select event in the File upload component
    const onFileSelect = async(args) => {
        setSelectedFile(null);
        const file = args.event.target.files;
        setSelectedFile(file[0]);
        setStatus({ statusCode: 0, message:'Ready to upload'});
    }

    // Click action for Upload file button
    const onUploadClick = async() => {
        // Get the presigned URL from Amazon S3
        const response = await axios({
            method: 'GET',
            url: API_ENDPOINT,
            // Passed original file name to the AWS lambda function
            params: {
                file_name: selectedFile.name
            }
        })

        console.log('Presigned URL', response.data.uploadURL);

        // Post the file to the presigned URL
        await fetch(response.data.uploadURL, {
            method: 'PUT',
            body: selectedFile
        })

        setStatus({ statusCode: 1, message: 'File uploaded successfully'});

        // Get the uploaded file path ---> response.data.uploadURL.split('?')[0]
    }

    // Convert the bytes to sizes
    const bytesToSize= (bytes)=> {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
     }

     // Created custom file list to showcase file information and upload status
     const createFileList = () => {
        var size = bytesToSize(selectedFile.size);
        return (
            <div className="e-upload custom-template">
                <ul className="e-upload-files">
                    <li className="e-upload-file-list">
                        <span className="e-file-container">
                            <span className="e-file-name">{selectedFile.name}</span>
                            <span className="e-file-size">{size}</span>
                            <span className={ status.statusCode ? "e-file-status e-upload-success" : "e-file-status"}>{status.message}</span> 
                        </span>
                    </li>
                </ul>
            </div>
        )
     }

    return (
        <div className="control-wrapper">
            {/* Rendering the Syncfusion file upload component */}
            <UploaderComponent
                id="fileUpload"
                selected={onFileSelect}
                multiple={false}
                showFileList={false}
            ></UploaderComponent>

            {/* Rendering the file list after selecting the file */}
            { selectedFile !== null && createFileList() }
            
            <button className='upload-btn e-btn e-primary' disabled={!(selectedFile != null && !status.statusCode)} onClick = {onUploadClick}>Upload File</button>
        </div>
    );
}

export default Upload