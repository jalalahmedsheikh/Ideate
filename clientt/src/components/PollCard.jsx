import React, { useState } from "react";
import { FaUserCircle, FaShare, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { color, motion } from "framer-motion"; // Importing motion from framer-motion for animations

const theme = {
  primary: "rgb(40, 0, 65)",
  secondary: "#fd1d1d",
  lightGray: "",
  green: "#00ff00",
  red: "#ff4d4d",
};

const PollCard = ({ poll, onVote, votedOption, pollResults }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [votes, setVotes] = useState([30, 70]); // Example vote percentages for each option
  const totalVotes = votes.reduce((acc, curr) => acc + curr, 0); // Total votes calculation

  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return; // Prevent re-selection after voting

    const newVotes = [...votes];
    newVotes[index] += 1; // Increment the selected option vote count
    setVotes(newVotes);
    setSelectedOption(index);
  };

  const calculatePercentage = (optionIndex) => {
    return ((votes[optionIndex] / totalVotes) * 100).toFixed(2); // Calculate percentage
  };

  return (
    <div style={styles.cardContainer} className="border w-100">
      <div style={styles.cardHeader}>
        <FaUserCircle className="fs-1 me-2" />
        <div>
          <div style={styles.username}>john_doe</div>
          <div style={styles.footer}>
            <span>2 hours ago</span>
          </div>
        </div>
      </div>

      <div style={styles.cardContent} className="user-select-none">
        <h3 style={styles.pollTitle}>{poll.question}</h3>
        {poll.options.map((option, index) => (
          <div key={index} style={styles.optionContainer}>
            <div
              onClick={() => handleOptionSelect(index)}
              style={{
                ...styles.optionButton,
                backgroundColor: selectedOption === index ? theme.primary : theme.lightGray,
              }}
            >
              <span>{option}</span>
            </div>
            {selectedOption !== null && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${calculatePercentage(index)}%` }}
                transition={{ duration: 1 }}
                style={{
                  ...styles.progressBar,
                  backgroundColor:
                    index === 0
                      ? theme.red
                      : index === 1
                      ? theme.green
                      : index === 2
                      ? theme.primary
                      : "#ffcc00", // Different colors for each option
                }}
              />
            )}
            {selectedOption !== null && (
              <div style={styles.votePercentage}>
                {calculatePercentage(index)}% of people chose this option
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={styles.cardActions} className="user-select-none">
        <div style={styles.actionButton}>
          <FaShare style={styles.icon} />
          <span>Share</span>
        </div>
        <div style={styles.actionButton}>
          <FaBookmark style={styles.icon}/>
          <span>Save</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  cardContainer: {
    width: "100%",
    maxWidth: "900px",
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
  cardContent: {
    padding: "15px",
  },
  pollTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  optionContainer: {
    marginBottom: "10px",
  },
  optionButton: {
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "background-color 0.3s ease",
  },
  progressBar: {
    height: "10px",
    borderRadius: "5px",
    marginTop: "5px",
  },
  votePercentage: {
    fontSize: "12px",
    color: "white",
    marginTop: "5px",
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
  footer: {
    fontSize: "12px",
    color: "#888",
  },
};

export default PollCard;
