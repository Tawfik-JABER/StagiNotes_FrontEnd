import React from 'react'
import image from '../../images/errorImage.jpg'
import '../../styles/404Page.css';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';

export default function Error() {

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // Redirects the user to the previous page
    };
    return (
        <div className="error-container">
            <img src={image} alt="Error 404" className="error-image" />
            <h2 className="error-message">
                La page que vous recherchez n'existe pas !!
            </h2>
            <Link onClick={goBack}>
                Retournez à La Page Précédente
            </Link>
        </div>
    );
}