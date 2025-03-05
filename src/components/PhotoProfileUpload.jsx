import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogTitle,
    IconButton,
    Box,
    Button,
    styled,
} from '@mui/material';
import {
    Close as CloseIcon,
    CameraAlt as CameraIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

import profile from "../images/profile_pic.png";


// Styled components
const StyledDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        backgroundColor: '#eee',
        color: 'white',
        minWidth: 400,
        margin: 0,
        borderRadius: '8px',
    },
});

const PhotoCircle = styled(Box)({
    width: 280,
    height: 280,
    borderRadius: '50%',
    border: '1px solidrgb(255, 255, 255)',
    margin: '20px auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
});

const ActionButton = styled(Button)({
    color: '#535252',
    textTransform: 'none',
    fontSize: '14px',
    padding: '8px 16px',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
});

const PhotoProfileUpload = ({ open, onClose }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);


    // Function to get the user type and token
    const getUserToken = () => {
        const tokenDir = localStorage.getItem("Token_dir");
        const tokenTutt = localStorage.getItem("Token_Tutt");
        const tokenForm = localStorage.getItem("Token_Form");
        const tokenStag = localStorage.getItem("Token_Stag");

        if (tokenDir) return { token: tokenDir, type: "director" };
        if (tokenTutt) return { token: tokenTutt, type: "tutteur" };
        if (tokenForm) return { token: tokenForm, type: "formatteur" };
        if (tokenStag) return { token: tokenStag, type: "stagiaire" };
        
        return null;
    };

    // Fetch current profile image when modal opens
    useEffect(() => {
        if (open) {
            const userData = getUserToken();
            if (!userData) return;

            axios.get(`http://127.0.0.1:8000/api/${userData.type}`, {
                headers: { Authorization: `Bearer ${userData.token}` }
            })
            .then(response => {
                if (response.data.data.image_url) {
                    setImageUrl(`http://127.0.0.1:8000/${response.data.data.image_url}`);
                }
            })
            .catch(error => console.error("Error fetching user data:", error));
        }
    }, [open]);

    // Handle image upload
    const handleImageUpload = async (event) => {
        const userData = getUserToken();
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post(
                `http://localhost:8000/api/${userData.type}/uploadProfileImage`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${userData.token}`,
                    },
                }
            );
            setImageUrl(response.data.image_url);
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete image
    const handleDelete = async () => {
        const userData = getUserToken();
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8000/api/${userData.type}/deleteProfileImage`, {
                headers: { Authorization: `Bearer ${userData.token}` },
            });
            setImageUrl(null);
        } catch (error) {
            console.error("Error deleting image:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <Box sx={{ p: 2 }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <DialogTitle sx={{ p: 0, color: "#303030", fontSize: "18px" }}>
                    Photo de profil
                </DialogTitle>
                <IconButton onClick={onClose} sx={{ color: "#303030" }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Photo Circle */}
            <PhotoCircle>
                {imageUrl ? (
                    <Box
                        component="img"
                        src={`${imageUrl}`}
                        alt="Profile"
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <Box
                    component="img"
                    src={`${profile}`}
                    alt="Profile"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                )}
            </PhotoCircle>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.1)", pt: 2 }}>
                <ActionButton component="label" startIcon={<CameraIcon />} disabled={loading}>
                    {loading ? "Téléchargement..." : "ajouter une image"}
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </ActionButton>
                <ActionButton onClick={handleDelete} startIcon={<DeleteIcon />} disabled={!imageUrl || loading}>
                    {loading ? "Suppression..." : "Supprimer"}
                </ActionButton>
            </Box>
        </Box>
    
    </StyledDialog>
    );
};

export default PhotoProfileUpload;



















































































































// import React, { useState } from 'react';
// import {
//     Dialog,
//     DialogTitle,
//     IconButton,
//     Box,
//     Button,
//     styled,
// } from '@mui/material';
// import {
//     Close as CloseIcon,
//     CameraAlt as CameraIcon,
//     Delete as DeleteIcon,
// } from '@mui/icons-material';

// // Styled components
// const StyledDialog = styled(Dialog)(({ theme }) => ({
//     '& .MuiDialog-paper': {
//         backgroundColor: '#1e1e1e',
//         color: 'white',
//         minWidth: 400,
//         minHeight: 500,
//         margin: 0,
//         borderRadius: '8px',
//     },
// }));

// const PhotoCircle = styled(Box)(({ theme }) => ({
//     width: 280,
//     height: 280,
//     borderRadius: '50%',
//     border: '1px solid rgba(255, 255, 255, 0.3)',
//     margin: '20px auto',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     overflow: 'hidden',
// }));

// const ActionButton = styled(Button)(({ theme }) => ({
//     color: 'white',
//     textTransform: 'none',
//     fontSize: '14px',
//     padding: '8px 16px',
//     '&:hover': {
//         backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     },
// }));

// const PhotoProfileUpload = ({ open, onClose }) => {
//     const [selectedImage, setSelectedImage] = useState(null);

//     const handleImageUpload = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setSelectedImage(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleDelete = () => {
//         setSelectedImage(null);
//     };

//     return (
//         <StyledDialog
//             open={open}
//             onClose={onClose}
//             maxWidth="sm"
//             fullWidth
//         >
//             <Box sx={{ p: 2 }}>
//                 {/* Header */}
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                     <DialogTitle sx={{ p: 0, color: 'white', fontSize: '18px' }}>
//                         Profile photo
//                     </DialogTitle>
//                     <IconButton
//                         onClick={onClose}
//                         sx={{ color: 'white' }}
//                     >
//                         <CloseIcon />
//                     </IconButton>
//                 </Box>

//                 {/* Photo Circle */}
//                 <PhotoCircle>
//                     {selectedImage && (
//                         <Box
//                             component="img"
//                             src={selectedImage}
//                             alt="Profile"
//                             sx={{
//                                 width: '100%',
//                                 height: '100%',
//                                 objectFit: 'cover',
//                             }}
//                         />
//                     )}
//                 </PhotoCircle>

//                 {/* Action Buttons */}
//                 <Box
//                     sx={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         mt: 2,
//                         borderTop: '1px solid rgba(255, 255, 255, 0.1)',
//                         pt: 2,
//                     }}
//                 >
//                     <ActionButton
//                         component="label"
//                         startIcon={<CameraIcon />}
//                     >
//                         Add photo
//                         <input
//                             type="file"
//                             hidden
//                             accept="image/*"
//                             onChange={handleImageUpload}
//                         />
//                     </ActionButton>
//                     <ActionButton
//                         onClick={handleDelete}
//                         startIcon={<DeleteIcon />}
//                         disabled={!selectedImage}
//                     >
//                         Delete
//                     </ActionButton>
//                 </Box>
//             </Box>
//         </StyledDialog>
//     );
// };

// export default PhotoProfileUpload;
