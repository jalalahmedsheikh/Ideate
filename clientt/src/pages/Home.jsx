import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle, FaShare, FaRegHeart, FaHeart, FaBookmark, FaRegBookmark } from "react-icons/fa"; // Importing necessary icons
import { motion } from "framer-motion";

const Home = () => {
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching the data from the API
  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/feed/trending-posts-polls");
        const feedItems = response.data.data;

        // Fetch detailed data for each post or poll using their _id
        const detailedFeedItems = await Promise.all(
          feedItems.map(async (item) => {
            if (item.type === "post") {
              const postResponse = await axios.get(`http://localhost:8000/post/${item._id}`);
              return postResponse.data; // Assuming the post data contains the full details
            } else if (item.type === "poll") {
              const pollResponse = await axios.get(`http://localhost:8000/poll/${item._id}`);
              return pollResponse.data; // Assuming the poll data contains the full details
            }
            return item; // Return the original item if type is unknown
          })
        );

        setFeedData(detailedFeedItems); // Set the fetched data with details
        setLoading(false);
      } catch (error) {
        console.error("Error fetching feed data", error);
        setLoading(false);
      }
    };

    fetchFeedData();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // PollCard Component
  const PollCard = ({ pollData }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [votes, setVotes] = useState(pollData.votes); // Poll options, assuming this contains vote counts
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
      <div className="card mb-4">
        <div className="card-header d-flex align-items-center">
          <FaUserCircle className="fs-1 me-2" />
          <div>
            <div className="fw-bold">john_doe</div>
            <div className="text-muted" style={{ fontSize: "12px" }}>2 hours ago</div>
          </div>
        </div>
        <div className="card-body">
          <h5>{pollData.question}</h5>
          {pollData.options.map((option, index) => (
            <div key={index} className="mb-3">
              <div
                onClick={() => handleOptionSelect(index)}
                className={`btn w-100 ${selectedOption === index ? 'btn-primary' : 'btn-light'}`}
              >
                {option}
              </div>
              {selectedOption !== null && (
                <>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calculatePercentage(index)}%` }}
                    transition={{ duration: 1 }}
                    className="progress mt-2"
                  >
                    <div
                      className="progress-bar"
                      style={{
                        width: `${calculatePercentage(index)}%`,
                        backgroundColor: index === 0 ? '#ff4d4d' : index === 1 ? '#00ff00' : '#0066cc',
                      }}
                    />
                  </motion.div>
                  <div className="mt-2">{calculatePercentage(index)}% of people chose this option</div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="card-footer d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <FaShare className="me-2" />
            <span>Share</span>
          </div>
          <div className="d-flex align-items-center">
            <FaBookmark className="me-2" />
            <span>Save</span>
          </div>
        </div>
      </div>
    );
  };

  // SocialCard Component
  const SocialCard = ({ postData }) => {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false); // Updated state name to 'saved'

    const toggleLike = () => setLiked(!liked);
    const toggleSave = () => setSaved(!saved);

    return (
      <div className="card mb-4">
        <div className="card-header d-flex align-items-center">
          <FaUserCircle className="fs-1 me-2" />
          <div>
            <div className="fw-bold">john_doe</div>
            <div className="text-muted" style={{ fontSize: "12px" }}>2 hours ago</div>
          </div>
        </div>
        <div className="card-body">
          <h5>{postData.title}</h5>
          <p>{postData.content}</p>
        </div>
        <div className="card-footer d-flex justify-content-between">
          <div
            onClick={toggleLike}
            className={`d-flex align-items-center ${liked ? 'text-primary' : ''}`}
          >
            {liked ? <FaHeart className="me-2" /> : <FaRegHeart className="me-2" />}
            <span>{liked ? 'Liked' : 'Like'}</span>
          </div>
          <div className="d-flex align-items-center">
            <span className="me-2"><i className="fa-regular fa-comment"></i></span>
            <span>Comment</span>
          </div>
          <div className="d-flex align-items-center">
            <FaShare className="me-2" />
            <span>Share</span>
          </div>
          <div onClick={toggleSave} className="d-flex align-items-center">
            {saved ? <FaBookmark className="me-2" /> : <FaRegBookmark className="me-2" />}
            <span>{saved ? 'Saved' : 'Save'}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {feedData.map((item, index) => (
          <div key={index} className="col-md-4 mb-4">
            {/* Conditionally render PollCard or SocialCard */}
            {item.type === "poll" ? (
              <PollCard pollData={item} />
            ) : (
              <SocialCard postData={item} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
