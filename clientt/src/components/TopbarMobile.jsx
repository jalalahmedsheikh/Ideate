import React from 'react'
import { FaChevronLeft, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function TopbarMobile() {
    const navigate = useNavigate();

    const goToSearch = () => {
      navigate('/search'); // Navigate to the search page
    };

    // Function to go back
    const goBack = () => {
        navigate(-1); // Navigate one step back in the history stack
    };


    return (
        <div className="container-fluid sticky-top bg-dark d-block d-md-none z-1">
            <div className="row" style={{ minHeight: "50px" }}>
                <div className="col shadow d-flex justify-content-between px-4 align-items-center">
                    <FaChevronLeft onClick={goBack} style={{ width: '20px', height: '20px' }} /><FaSearch onClick={goToSearch} style={{ width: '20px', height: '20px' }} />
                </div>
            </div>
        </div>
    )
}
