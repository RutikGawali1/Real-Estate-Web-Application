export function displayMedia(url, container) {
    if (!url) return;
    const isDataUrl = url.startsWith('data:');
    let fileType;
    
    if (isDataUrl) {
        const mimeType = url.split(',')[0].split(':')[1].split(';')[0];     
        if (mimeType.startsWith('image/')) { fileType = 'image'; }
        else if (mimeType.startsWith('video/')) { fileType = 'video'; }
        else if (mimeType === 'application/pdf') { fileType = 'pdf'; }
        else { fileType = 'other'; }
    } else {
        const ext = url.split('.').pop().toLowerCase();  
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) { fileType = 'image'; } 
        else if (['mp4', 'webm', 'ogg'].includes(ext)) { fileType = 'video'; } 
        else if (ext === 'pdf') { fileType = 'pdf'; } 
        else { fileType = 'other'; }
    }
    
    switch (fileType) {
        case 'image':
            container.innerHTML = `<img src="${url}" alt="Uploaded Image" class="img-fluid rounded" style="max-height: 300px;">`;
            break;
        case 'video':
            container.innerHTML = `
            <video controls class="w-100 rounded" style="max-height: 300px;">
                <source src="${url}">
                Your browser does not support the video tag.
            </video>`;
            break;
        case 'pdf':
            container.innerHTML = `
            <div class="pdf-container w-100">
                <embed src="${url}" type="application/pdf" width="100%" height="100%" class="rounded">
                <div class="mt-2">
                    <a href="${url}" target="_blank" class="btn btn-sm btn-primary">
                        <i class="fas fa-external-link-alt me-1"></i> Open PDF in New Tab
                    </a>
                </div>
            </div>`;
            break;
        default:
            container.innerHTML = `
            <div class="file-link text-center p-3 border rounded">
                <i class="fas fa-file fa-2x mb-2 text-secondary"></i>
                <p class="mb-2">File uploaded successfully</p>
                <a href="${url}" target="_blank" class="btn btn-outline-secondary">
                    <i class="fas fa-download me-1"></i> Download File
                </a>
            </div>`;
    }
}