# 🏡 Real Estate Property Web Application

A full-stack MERN application to manage real estate listings with features like:
- User authentication (Register/Login)
- Add, view, and delete properties
- Cloudinary image upload integration
- Search & filter properties by title and location
- Pagination for better listing experience
- Image loading placeholders for smooth UX

---

##  Tech Stack

- **Frontend**: React, Tailwind CSS, Axios, React Router DOM
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT-based login system
- **Image Hosting**: [Cloudinary](https://cloudinary.com/)

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/real-estate-app.git
cd real-estate-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
MONGO_URI=mongodb://localhost:27017/realestate
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
```

Start the backend server:
```bash
npm start
# or for development
npm run dev
```
Backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file in frontend folder (optional):
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
REACT_APP_CLOUDINARY_API_KEY=your_cloudinary_api_key
```

Start the frontend development server:
```bash
npm start
```
Frontend will run on `http://localhost:3000`

```

### Frontend (.env) - Optional
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

---

## 📱 Usage

1. **Start the application**:
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

2. **Register/Login**: Create an account or login with existing credentials

3. **Add Properties**: Navigate to Dashboard to add new properties with images

4. **Browse Properties**: View all properties on the Home page with pagination

5. **Search**: Use the search filters to find properties by title or location

6. **Manage Properties**: Edit or delete your own properties from the Dashboard

---

## 🎨 Key Features Explained

### Pagination
- Displays 10 properties per page
- Smart page number display with ellipsis
- Previous/Next navigation buttons
- Shows current page range and total entries

### Image Handling
- **Cloudinary Integration**: Secure image upload and storage
- **Loading States**: Placeholder while images load
- **Error Handling**: Fallback for failed image loads
- **Public ID Storage**: Efficient Cloudinary URL resolution

### Search & Filter
- Real-time search by property title
- Location-based filtering
- Combines multiple search criteria

### Authentication
- JWT-based secure authentication
- Protected routes for property management
- User-specific property ownership

---

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Update API URLs in environment variables

### Backend (Heroku/Railway)
1. Set environment variables on hosting platform
2. Ensure MongoDB connection string is correct
3. Deploy backend code

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, email your-email@example.com or create an issue in the GitHub repository.

---

## 🔗 Links

- **Live Demo**: [Your Live Demo URL]
- **Cloudinary Documentation**: https://cloudinary.com/documentation

---

*Made with ❤️ using MERN Stack*
