import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import './Files.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faDownload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function Files() {
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [selectedFileIndex, setSelectedFileIndex] = useState(null);

    const handleFileChange = (event) => {
        const filesArray = Array.from(event.target.files);
        setSelectedFile(filesArray);
    };

    useEffect(() => {
        const storedPassword = localStorage.getItem('password');

        if (storedPassword !== 'Kothari@111' ||  storedPassword !== "@iamHK12") {
            navigate('/logout');
        }

        // eslint-disable-next-line
    }, []);

    const handleFileUpload = async () => {
        if (!selectedFile || selectedFile.length === 0) return;

        for (const file of selectedFile) {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = async () => {
                const base64String = reader.result.split(',')[1];

                try {
                    const response = await fetch('http://localhost:5000/upload', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ data: base64String, fileName: file.name }), // Pass the original file name to the server
                    });

                    if (response.ok) {
                        alert(`File ${file.name} uploaded successfully!`);
                    } else {
                        const errorData = await response.json();
                        alert(`Failed to upload the file ${file.name}: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error(`Error uploading file ${file.name}:`, error);
                    alert(`Failed to upload the file ${file.name}.`);
                }
            };
        }

        // After uploading all files, refresh the list of files
        getFiles();
        setSelectedFile([]);
    };

    const getFiles = async () => {
        try {
            const response = await fetch('http://localhost:5000/getFiles');
            const data = await response.json();
            setFiles(data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    useEffect(() => {
        getFiles(); // Fetch files when the component mounts
    }, []);

    const handleFileViewOrDownload = (base64String, fileName) => {
        // Determine the file extension from the file name
        const extension = fileName.split('.').pop();

        // Convert base64String to a Blob
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: `application/${extension}` });

        // Use a temporary anchor element to handle file download/viewing
        const tempAnchor = document.createElement('a');
        tempAnchor.href = URL.createObjectURL(blob);
        tempAnchor.target = '_blank'; // Open the file in a new tab

        // Use the original file name for download
        tempAnchor.download = fileName;

        tempAnchor.click();
    };

    const handleFileDelete = async (fileId) => {
        try {
            const response = await fetch(`http://localhost:5000/deleteFile/${fileId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('File deleted successfully!');
                getFiles();
            } else {
                const errorData = await response.json();
                alert(`Failed to delete the file: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete the file.');
        }
    };

    const Popup = ({ file }) => {
        return (
            <div className="popup">
                {/* <h3>{file.fileName}</h3> */}
                <br />
                <p style={{ fontSize: "11px" }}>Upload Date: {showDate(new Date(file.uploadDate))}</p>
                <button className='downloadIcon' onClick={() => handleFileViewOrDownload(file.data, file.fileName)}>
                    <FontAwesomeIcon icon={faDownload} />
                </button>
                &nbsp;&nbsp;
                <button className='deleteIcon' onClick={() => handleFileDelete(file._id)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                </button>
            </div>
        );
    };

    const showDate = (dt) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        return dt.toLocaleDateString(undefined, options);
    };

    const handleFileDatePopup = (index) => {
        setSelectedFileIndex(index === selectedFileIndex ? null : index);
    };

    useEffect(() => {
        // const logoutTimer = setTimeout(() => {
        //     // Navigate to the logout page when the timer expires
        //     navigate('/logout');
        // }, 10 * 60 * 1000); // 10 minutes in milliseconds
        const logoutTimer = setTimeout(() => {
            // Navigate to the logout page when the timer expires
            navigate('/logout');
        }, 10 * 60 * 1000); // 10 minutes in milliseconds

        // Clear the timer when the component unmounts or the user logs out
        return () => clearTimeout(logoutTimer);
    }, [navigate]);

    return (
        <div className="App">
            <div className='fileUploadDiv'>
                <h1 className='headerH1'>File Upload</h1>
                <input type="file" className='file_input' onChange={handleFileChange} multiple />
                <button className='uploadBtn' onClick={handleFileUpload}><FontAwesomeIcon icon={faCloudUploadAlt} /></button>
            </div>

            <NavLink to="/logout" className='logoutBtn'>Log out </NavLink>

            <div className="file-list">
                <h1 style={{ margin: "40px 0px" }}>Files:</h1>
                <div>
                    {files.map((file, index) => (
                        <div className={"varfile"} key={index}>
                            <button className={'fileBtn' + (selectedFileIndex === index ? " activeFile" : "")} onClick={() => handleFileDatePopup(index)}>
                                {file.fileName}
                            </button>
                            {selectedFileIndex === index && (
                                <Popup file={file} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Files;
