const API_BASE_URL = 'http://localhost:5000/api/cloudinary';

export async function uploadToCloudinary(file, folder, publicId) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder || 'uploads');
    if (publicId) {
        formData.append('publicId', publicId);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('Upload successful:', data.data);
            return data.data;
        } else {
            console.error('Upload failed:', data.message);
            throw new Error(data.message || 'Upload failed');
        }
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

export async function getCloudinaryFile(publicId) {
    try {
        const response = await fetch(`${API_BASE_URL}/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ publicId })
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
            return data.data;
        } else {
            console.error('File retrieval failed:', data.message);
            throw new Error(data.message || 'File retrieval failed');
        }
    } catch (error) {
        console.error('Error fetching file from Cloudinary:', error);
        throw error;
    }
}

export async function deleteFromCloudinary(publicId) {
    try {
        const response = await fetch(`${API_BASE_URL}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ publicId })
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('File deleted successfully');
            return true;
        } else {
            console.error('File deletion failed:', data.message);
            throw new Error(data.message || 'File deletion failed');
        }
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw error;
    }
}

export async function getFilesByFolder(folder) {
    try {
        const response = await fetch(`${API_BASE_URL}/folder/${folder}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('Files retrieved successfully:', data.data);
            return data.data;
        } else {
            console.error('Files retrieval failed:', data.message);
            throw new Error(data.message || 'Files retrieval failed');
        }
    } catch (error) {
        console.error('Error fetching files from Cloudinary:', error);
        throw error;
    }
}