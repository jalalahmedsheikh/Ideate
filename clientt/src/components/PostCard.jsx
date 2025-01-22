import React, { useState } from "react";
import { FaUserCircle, FaShare } from "react-icons/fa";  // Import FaShare for the share icon
import { FaRegHeart, FaHeart } from "react-icons/fa"; 
import { FaBookmark, FaRegBookmark } from "react-icons/fa"; // Import bookmark icons

const theme = {
  primary: "rgb(40, 0, 65)",
  secondary: "#fd1d1d",
  lightGray: "#f1f1f1",
};

const SocialCard = () => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);  // Updated state name to 'saved' to avoid conflict with 'Save'

  const toggleLike = () => {
    setLiked(!liked);
  };

  const toggleSave = () => {
    setSaved(!saved);  // Toggle the 'saved' state properly
  };

  return (
    <div style={styles.cardContainer}>
      <div style={styles.cardHeader}>
        <div>
          <FaUserCircle className="fs-1 me-2" />
        </div>
        <div>
          <div style={styles.username}>john_doe</div>
          <div style={styles.footer}>
            <span>2 hours ago</span>
          </div>
        </div>
      </div>
      <div style={styles.cardImage}>
        <h5>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet itaque, aliquam quo minima asperiores commodi rerum iste quia sint voluptatum quaerat ab neque autem harum veniam.</h5>
      </div>
      <div style={styles.cardActions}>
        <div
          onClick={toggleLike}
          style={{
            ...styles.actionButton,
            animation: liked ? "shake 0.5s ease-in-out" : "none", // Apply shake only when liked
          }}
        >
          <span
            style={{
              ...styles.icon,
              color: liked ? theme.primary : theme.secondary, // Set heart color
            }}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
          </span>
          <span>{liked ? "Liked" : "Like"}</span>
        </div>
        <div style={styles.actionButton}>
          <span style={styles.icon}><i className="fa-regular fa-comment"></i></span>
          <span>Comment</span>
        </div>
        <div style={styles.actionButton}>
          <span style={styles.icon}><FaShare /> {/* Use FaShare from react-icons/fa */}</span>
          <span>Share</span>
        </div>
        <div onClick={toggleSave} style={styles.actionButton}>  {/* Added onClick to trigger toggleSave */}
          <span style={styles.icon}>
            {saved ? <FaBookmark /> : <FaRegBookmark />}  {/* Use the 'saved' state */}
          </span>
          <span>{saved ? "Saved" : "Save"}</span>
        </div>
      </div>
      <div style={styles.cardContent}>
        <span style={styles.likesCount}>
          {liked ? "1 Like" : "0 Likes"}
        </span>
      </div>
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
    height: "300px",
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

// Adding the shake animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
  }
`, styleSheet.cssRules.length);

export default SocialCard;