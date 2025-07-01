import React, { useState, useRef, useEffect } from 'react';
import { uploadToCloudinary, getCloudinaryFile, deleteFromCloudinary } from '../cloudinary/index.js';
import { displayMedia } from '../cloudinary/display.js';
import './CloudinaryDemo.css';

export default function CloudinaryDemo() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [folder, setFolder] = useState('');
    const [uploadPublicId, setUploadPublicId] = useState('');
    const [getPublicId, setGetPublicId] = useState('');
    const [result, setResult] = useState('');
    const [uploadedFileData, setUploadedFileData] = useState(null);
    const [loading, setLoading] = useState(false);

    const filePreviewRef = useRef(null);

    useEffect(() => {
        if (uploadedFileData && uploadedFileData.secure_url && filePreviewRef.current) {
            displayMedia(uploadedFileData.secure_url, filePreviewRef.current);
        } else if (filePreviewRef.current) {
            filePreviewRef.current.innerHTML = '';
        }
    }, [uploadedFileData]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile || !folder.trim() || !uploadPublicId.trim()) {
            alert("Please select a file and fill in both folder and public ID fields.");
            return;
        }

        setLoading(true);
        try {
            const uploadResult = await uploadToCloudinary(selectedFile, folder.trim(), uploadPublicId.trim());

            if (uploadResult) {
                setResult(JSON.stringify(uploadResult, null, 2));
                setUploadedFileData(uploadResult);
            } else {
                setResult(JSON.stringify({ error: "Upload failed" }, null, 2));
            }
        } catch (error) {
            setResult(JSON.stringify({ error: error.message }, null, 2));
        } finally {
            setLoading(false);
        }
    };

    const handleGetFile = async () => {
        if (!getPublicId.trim()) {
            alert("Please enter a public ID to fetch info.");
            return;
        }

        setLoading(true);
        try {
            const fileInfo = await getCloudinaryFile(getPublicId.trim());

            if (fileInfo) {
                setResult(JSON.stringify(fileInfo, null, 2));
                setUploadedFileData(fileInfo);
            } else {
                setResult(JSON.stringify({ error: "File not found or fetch failed" }, null, 2));
            }
        } catch (error) {
            setResult(JSON.stringify({ error: error.message }, null, 2));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!getPublicId.trim()) {
            alert("Please enter a public ID to delete.");
            return;
        }

        if (!window.confirm(`Are you sure you want to delete the file with public ID: ${getPublicId}?`)) {
            return;
        }

        setLoading(true);
        try {
            const deleteResult = await deleteFromCloudinary(getPublicId.trim());

            if (deleteResult) {
                setResult(JSON.stringify({
                    success: true,
                    message: `Successfully deleted file with public ID: ${getPublicId}`
                }, null, 2));
                setUploadedFileData(null);
            } else {
                setResult(JSON.stringify({
                    success: false,
                    message: `Failed to delete file with public ID: ${getPublicId}`
                }, null, 2));
            }
        } catch (error) {
            setResult(JSON.stringify({ error: error.message }, null, 2));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cloudinary-demo">
            <header className="text-center mb-4"> <h2>🌥️ Cloudinary Upload Demo</h2> </header>

            <div className="main-container">
                <main className="upload-section">
                    <h4 className="section-title">Upload File</h4>

                    <div className="file-upload-container mb-3">
                        <label className="file-upload">
                            <input type="file" onChange={handleFileChange} accept="image/*,video/*,.pdf,.doc,.docx" />
                            <div className="upload-content">
                                <i className="fas fa-cloud-upload-alt mb-2"></i>
                                <span className="fw-bold">Click to choose file</span>
                                <span className="text-muted">or drag & drop here</span>
                                {selectedFile && ( <p className="mt-2 text-primary"> Selected: {selectedFile.name} </p> )}
                            </div>
                        </label>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="folder" className="form-label"> Folder Name </label>
                        <input type="text" id="folder" className="w-75 form-control" placeholder="e.g. Bluestock Career App/User/UserId" value={folder} onChange={(e) => setFolder(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="uploadPublicId" className="form-label"> Public ID </label>
                        <input type="text" id="uploadPublicId" className="w-75 form-control" placeholder="e.g. profile_pic" value={uploadPublicId} onChange={(e) => setUploadPublicId(e.target.value)} />
                    </div>

                    <button className="btn btn-success w-100" onClick={handleUpload} disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </main>

                <main className="operations-section">
                    <h4 className="section-title">File Operations</h4>

                    <div className="mb-3">
                        <label htmlFor="getPublicId" className="form-label"> Public ID </label>
                        <input type="text" id="getPublicId" className="form-control" placeholder="e.g. profile_pic" value={getPublicId} onChange={(e) => setGetPublicId(e.target.value)} />
                    </div>

                    <div className="btn-group-vertical w-100">
                        <button className="btn btn-info mb-2" onClick={handleGetFile} disabled={loading} >
                            {loading ? 'Getting...' : 'Get File Info'}
                        </button>

                        <button className="btn btn-danger" onClick={handleDelete} disabled={loading} >
                            {loading ? 'Deleting...' : 'Delete File'}
                        </button>
                    </div>
                </main>
            </div>

            <div className="output-section">
                <section className="result-section">
                    <h5>Result</h5>
                    <pre className="result-box"> {result || 'No operations performed yet...'} </pre>
                </section>

                <section className="uploaded-file-section">
                    <h5>Uploaded File Preview</h5>
                    <div className="file-preview" ref={filePreviewRef}></div>
                </section>
            </div>
        </div>
    );
}