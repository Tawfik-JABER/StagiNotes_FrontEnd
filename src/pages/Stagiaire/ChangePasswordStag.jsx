import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ChangePasswordStag() {
    //--------------------------------------- Check the token 
    useEffect(() => {
        const accesToken = localStorage.getItem('Token_Stag');
        if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
            navigate('/stagiaire/login')
        }
    },[])
    const navigate = useNavigate()
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const accesToken = localStorage.getItem('Token_Stag');
        axios.post(`http://localhost:8000/api/stagiaire/changePassword`, {
                current_password: currentPassword,
                new_password: newPassword,
                password_confirmation: confirmPassword,
            }, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${accesToken}`
                }
                }).then((response) => {
                setSuccess(response.data.message);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => navigate("/stagiaire"), 1000);
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    console.log(error.response.data); // Output the response data to the console
                    setError(error.response.data.error);
                } else {
                    setError('Something went wrong. Please try again.');
                }
            });
    };

    return (
        <div>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="current_password">Current Password</label>
                    <input
                        type="password"
                        id="current_password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="new_password">New Password</label>
                    <input
                        type="password"
                        id="new_password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="confirm_password">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm_password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Change Password</button>
            </form>
        </div>
    );
};


