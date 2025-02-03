import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaUserCircle, FaShare, FaEllipsisV, FaEdit, FaTrash, FaFlag } from "react-icons/fa";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { formatDistanceToNow, parseISO } from 'date-fns';
import verifiedBadge from '../assets/images/verified.png';
import { animate } from "framer-motion";
import PostPage from "./PostPage";
import axiosInstance from "./axiosInstance";

const theme = {
  primary: "rgb(40, 0, 65)",
  secondary: "#fd1d1d",
  lightGray: "dark",
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});  // Initially, an empty object
  const [savedPosts, setSavedPosts] = useState({});
  const [activeTab, setActiveTab] = useState("explore"); // "explore" or "followings"
  const [showMenu, setShowMenu] = useState(null); // State to track the open menu
  const [showAction, setShowAction] = useState(false); // For post's three-dot action btn

  // Fetch Posts from API
  const fetchPosts = (tab) => {
    setLoading(true); // Show loading

    if (tab === "explore") {
      const url = "http://localhost:8000/post/allposts";
      axios
        .get(url)
        .then((response) => {
          setPosts(response.data.posts);
          setLoading(false); // Hide loading
        })
        .catch((error) => {
          setError("Check your network and try again.");
          setLoading(false); // Hide loading
        });
    } else {
      // For "followings" tab, we clear the posts or show an empty state.
      setPosts([]);
      setLoading(false); // Hide loading immediately for empty followings state
    }
  };

  useEffect(() => {
    fetchPosts(activeTab); // Fetch posts for the active tab
  }, [activeTab]); // When tab changes, fetch posts

  // Retrieve liked posts from localStorage
  useEffect(() => {
    const storedLikedPosts = JSON.parse(localStorage.getItem("likedPosts")) || {};
    setLikedPosts(storedLikedPosts); // Update the likedPosts state with localStorage data
  }, []);

  // Save liked posts to localStorage
  const saveLikedPostsToLocalStorage = (likedPosts) => {
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
  };

  // Toggle like functionality
  const toggleLikePost = async (postId) => {
    console.log(postId);

    const token = Cookies.get('token'); // Get the token from cookies

    if (!token) {
      navigate('/auth'); // Redirect to authentication page if no token
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/post/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        }
      });

      // Update liked posts state after successful response
      const updatedLikedPosts = {
        ...likedPosts,
        [postId]: response.data.liked, // Assuming your backend returns 'liked' flag
      };

      // Save the updated liked posts in localStorage
      saveLikedPostsToLocalStorage(updatedLikedPosts);

      // Update the state with the new liked posts
      setLikedPosts(updatedLikedPosts);

      console.log('Post Liked:', response);
    } catch (error) {
      console.log('Error liking post:', error.response?.data?.message || error.message);
    }
  };
  function ToggleMenu() {
    //logic for action btn 
    if (showAction) {
      setShowAction(false)
    } else {
      setShowAction(true)
    }

  }

  // Toggle save functionality
  const toggleSave = async (postId) => {
    const token = Cookies.get('token');
    try {
      if (savedPosts[postId]) {
        await axios.post(`http://localhost:8000/post/${postId}/unsavepost`, {}, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          }
        });
        setSavedPosts((prevState) => ({
          ...prevState,
          [postId]: false,
        }));
      } else {
        await axios.post(`http://localhost:8000/post/${postId}/savepost`, {}, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          }
        });
        setSavedPosts((prevState) => ({
          ...prevState,
          [postId]: true,
        }));
      }
    } catch (error) {
      console.error("Error toggling save", error);
    }
  };

  // Function to format time to "time ago" format
  const formatTimeAgo = (createdAt) => {
    const parsedDate = parseISO(createdAt); // Parse the ISO date
    return formatDistanceToNow(parsedDate) + ' ago'; // Format the date to "time ago"
  };

  const navigate = useNavigate();  // Initialize navigate
  const comment = (postId) => {
    navigate(`/post/${postId}`, { state: { postId } }); // Send postId as state
  };

  if (loading) {
    return <div className="text-center">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center">{error}</div>;
  }

  return (
    <div className="app">
      <div className="head sticky-top user-select-none">
        <h1 className="text-white text-center d-none d-lg-block">Home</h1>
        {/* Tab Navigation */}
        <div className="tabs-container">
          <div
            className={`tab ${activeTab === "explore" ? "text-white border-bottom border-3 rounded-0" : "text-secondary"}`}
            onClick={() => setActiveTab("explore")}
          >
            Explore
          </div>
          <div
            className={`tab ${activeTab === "followings" ? "text-white border-bottom border-3 rounded-0" : "text-secondary"}`}
            onClick={() => setActiveTab("followings")}
          >
            Followings
          </div>
        </div>
      </div>

      {/* Adding the shake animation style directly here */}
      <style>
        {`
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
          }
          .tabs-container {
            display: flex;
            justify-content: center;
            margin-top: 20px;
          }
          .tab {
            margin: 0 20px;
            padding: 10px 20px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            color: #fff;
            border-radius: 8px;
          }
          .tab.active {
            background-color: ${theme.primary};
          }
        `}
      </style>

      {/* Conditional Rendering for Followings Tab */}
      {activeTab === "followings" && posts.length === 0 ? (
        <div className="text-center mt-5">
          <h5>No posts to show. Follow some users to see their posts.</h5>
        </div>
      ) : (
        // Display Posts
        posts.map((post) => (
          <div key={post.id} style={styles.cardContainer} className="border">
            <div style={styles.cardHeader}>
              <Link className=" user-select-none text-decoration-none text-white" to={`/profile/${post.author._id}`} style={styles.username}>
                <div>
                  {
                    post.author.profileImage ? <img src={post.author.profileImage} alt={post.author.username} /> : <FaUserCircle className="fs-1 me-2" />
                  }
                </div>
              </Link>
              <div className="w-100">
                <Link className=" user-select-none text-decoration-none text-white" to={`/profile/${post.author._id}`} style={styles.username}>
                  {post.author.username || "Ideate-user"}{post.author.isverified ? <img
                    src={verifiedBadge}
                    alt="Verified"
                    style={{ width: '20px', height: '15px', marginLeft: '3px', verticalAlign: 'middle' }}
                    className=""
                  /> : ""} 
                </Link>
                <div style={styles.footer} className="user-select-none">
                  <span>{formatTimeAgo(post.createdAt)}</span> {/* Display the formatted time */}
                </div>
              </div>
              <div style={{ minWidth: '150px' }} className="user-select-none">
                <div className='w-100 d-flex justify-content-end mb-2'>
                  <FaEllipsisV className="" onClick={ToggleMenu} />
                </div>
                <div className={`menu bg-white text-dark rounded-bottom rounded-start p-2 ${!showAction && "d-none"} ms-4 position-absolute`}>
                  <ul className=" list-group">
                    <li className=" text-decoration-none list-unstyled fs-6"><FaEdit /> Edit Post</li><hr />
                    <li className=" text-decoration-none list-unstyled fs-6"><FaTrash /> Delete Post</li><hr />
                    <li className=" text-decoration-none list-unstyled fs-6"><FaFlag /> Report Post</li>
                  </ul>
                </div>
              </div>
            </div>
            <div style={styles.cardImage}>
              <h5>
                {post.caption.length > 100 ? `${post.caption.slice(0, 100)}...` : post.caption}
                {post.caption.length > 100 && (
                  <Link className="user-select-none text-decoration-none py-5" to={`/post/${post._id}`}>
                    <small className="text-white bg-secondary px-2 rounded">More</small>
                  </Link>
                )}
              </h5>
            </div>
            <div style={styles.cardActions} className="user-select-none">
              <div
                onClick={() => toggleLikePost(post._id)}
                style={{
                  ...styles.actionButton,
                  animation: likedPosts[post._id] ? "shake 0.5s ease-in-out" : "none", // Make sure you're using post._id here
                }}
              >
                <span
                  style={{
                    ...styles.icon,
                    color: likedPosts[post._id] ? theme.primary : theme.secondary, // Use post._id here for likedPosts
                  }}
                >
                  {post.likes.includes(userId) || likedPosts[post._id] ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart className="text-white" />
                  )}
                </span>
                <span>{likedPosts[post._id] ? "Liked" : "Like"}</span> {/* Use post._id for correct state */}
              </div>

              <Link style={styles.actionButton} className=" user-select-none text-decoration-none text-white" to={`/post/${post._id}`}>
                <span style={styles.icon}><i className="fa-regular fa-comment"></i></span>
                <span>Comment</span>
              </Link>

              <div onClick={() => toggleSave(post._id)} style={styles.actionButton}>
                <span style={styles.icon}>
                  {savedPosts[post.id] ? <FaBookmark /> : <FaRegBookmark />}
                </span>
                <span>{savedPosts[post.id] ? "Saved" : "Save"}</span>
              </div>
            </div>
            <div style={styles.cardContent}>
              <span style={styles.likesCount}>
                {`${post.likes.length} Likes`}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  cardContainer: {
    width: "100%",
    maxWidth: "500px",
    margin: "20px auto",
    backgroundColor: theme.lightGray,
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
  },
  username: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  cardImage: {
    width: "100%",
    overflow: "hidden",
    padding: "25px",
  },
  cardActions: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 15px",
  },
  actionButton: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "color 0.3s ease",
  },
  icon: {
    fontSize: "20px",
    marginRight: "5px",
  },
  cardContent: {
    padding: "10px 15px",
  },
  likesCount: {
    fontWeight: "bold",
  },
  footer: {
    fontSize: "12px",
    color: "#888",
  },
};

export default Home;
