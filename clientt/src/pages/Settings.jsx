import React, { useState } from 'react';
import axios from 'axios';

const Settings = () => {
    const [settings, setSettings] = useState({
        name: '',
        username: '',
        email: '',
        profileImage: '',
        bio: '',
        gender: '',
        twitter: '',
        facebook: '',
        instagram: '',
        category: 'Ideate-User',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (settings.password && settings.password !== settings.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Create the payload object only with non-empty fields
        const payload = {};

        if (settings.name) payload.name = settings.name;
        if (settings.username) payload.username = settings.username;
        if (settings.email) payload.email = settings.email;
        if (settings.profileImage) payload.profileImage = settings.profileImage;
        if (settings.bio) payload.bio = settings.bio;
        if (settings.gender) payload.gender = settings.gender;
        if (settings.twitter) payload.twitter = settings.twitter;
        if (settings.facebook) payload.facebook = settings.facebook;
        if (settings.instagram) payload.instagram = settings.instagram;
        if (settings.category) payload.category = settings.category;
        if (settings.password) payload.password = settings.password; // Only include password if it's filled

        try {
            // Send the PUT request to the API with only the fields that are filled
            const response = await axios.put(
                'http://localhost:8000/user/profile/update',
                payload, // Sending the payload directly
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // Add Authorization token here if required
                        // 'Authorization': `Bearer ${authToken}`,
                    },
                }
            );

            // Check if the request was successful
            if (response.status !== 200) {
                throw new Error('Failed to update profile');
            }

            alert('Profile updated successfully!');
            console.log('Updated profile:', response.data);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile, please try again.');
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-form">
                <h1>User Settings</h1>
                <form onSubmit={handleSubmit}>
                    {/* Profile Image */}
                    <div className="form-group">
                        <label htmlFor="profileImage">Profile Image URL</label>
                        <input
                            type="text"
                            id="profileImage"
                            name="profileImage"
                            value={settings.profileImage}
                            onChange={handleChange}
                            placeholder="Enter the URL of your profile image"
                        />
                    </div>

                    {/* Name */}
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={settings.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Username */}
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={settings.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={settings.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Bio */}
                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={settings.bio}
                            onChange={handleChange}
                            placeholder="Write a short bio"
                        />
                    </div>

                    {/* Gender */}
                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={settings.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Social Links */}
                    <div className="form-group">
                        <label htmlFor="twitter">Twitter</label>
                        <input
                            type="text"
                            id="twitter"
                            name="twitter"
                            value={settings.twitter}
                            onChange={handleChange}
                            placeholder="Enter your Twitter link"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="facebook">Facebook</label>
                        <input
                            type="text"
                            id="facebook"
                            name="facebook"
                            value={settings.facebook}
                            onChange={handleChange}
                            placeholder="Enter your Facebook link"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="instagram">Instagram</label>
                        <input
                            type="text"
                            id="instagram"
                            name="instagram"
                            value={settings.instagram}
                            onChange={handleChange}
                            placeholder="Enter your Instagram link"
                        />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={settings.category}
                            onChange={handleChange}
                        >
                            <option value="Ideate-User">Ideate-User</option>
                            <option value="sport">Sport</option>
                            <option value="politician">Politician</option>
                            <option value="actor">Actor</option>
                            <option value="musician">Musician</option>
                            <option value="Mern Stack Developer">Mern Stack Developer</option>
                            <option value="entrepreneur">Entrepreneur</option>
                            <option value="artist">Artist</option>
                            <option value="creator">Creator</option>
                        </select>
                    </div>

                    {/* Password Update */}
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={settings.password}
                            onChange={handleChange}
                            placeholder="Enter a new password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={settings.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your new password"
                        />
                    </div>

                    <button type="submit">Save Changes</button>
                </form>
            </div>

            {/* CSS Styling */}
            <style jsx>{`
                .settings-page {
                    display: flex;
                    justify-content: center;
                    min-height: 100vh;
                    background-color: #121212;
                    color: white;
                    padding: 20px;
                }

                .settings-form {
                    width: 100%;
                    max-width: 600px;
                    background-color: #1f1f1f;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
                }

                h1 {
                    font-size: 28px;
                    margin-bottom: 20px;
                    text-align: center;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                label {
                    display: block;
                    font-size: 16px;
                    margin-bottom: 8px;
                }

                input,
                textarea,
                select {
                    width: 100%;
                    padding: 12px;
                    font-size: 16px;
                    background-color: #222;
                    color: white;
                    border: 1px solid #555;
                    border-radius: 4px;
                }

                textarea {
                    min-height: 100px;
                    resize: vertical;
                }

                button {
                    padding: 12px 20px;
                    background-color: dark;
                    color: black;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                    border-radius: 5px;
                    width: 100%;
                }

                button:hover {
                    background-color:rgb(82, 82, 82);
                    color: white;
                }

                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    .settings-form {
                        padding: 20px;
                    }

                    h1 {
                        font-size: 24px;
                    }

                    input,
                    textarea,
                    select {
                        font-size: 14px;
                    }

                    button {
                        font-size: 14px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Settings;
