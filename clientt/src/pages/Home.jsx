import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import axios for API calls

function Home() {
  const [Polls, setPolls] = useState([]);
  const [Posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votedPolls, setVotedPolls] = useState({});
  const [pollResults, setPollResults] = useState({});

  // Fetch Poll Data from API
  useEffect(() => {
    axios
      .get('http://localhost:8000/poll/allpolls')  // API call to fetch polls
      .then((response) => {
        setPolls(response.data.polls);
      })
      .catch((error) => {
        console.error('Error fetching polls:', error);
      });

    axios
      .get('http://localhost:8000/post/allposts')  // API call to fetch posts
      .then((response) => {
        setPosts(response.data.posts);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);

  // Handle vote logic
  const handleVote = (pollId, selectedOption) => {
    const updatedPolls = Polls.map((poll) => {
      if (poll.id === pollId) {
        const updatedOptions = poll.options.map((option) => {
          if (option.text === selectedOption) {
            option.votes += 1;
          }
          return option;
        });
        poll.options = updatedOptions;
      }
      return poll;
    });

    setPolls(updatedPolls);
    setVotedPolls({
      ...votedPolls,
      [pollId]: selectedOption,
    });

    calculatePollResults(updatedPolls);
  };

  const calculatePollResults = (updatedPolls) => {
    const results = updatedPolls.reduce((acc, poll) => {
      const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
      const optionsWithPercentages = poll.options.map((option) => {
        return {
          text: option.text,
          percentage: totalVotes === 0 ? 0 : ((option.votes / totalVotes) * 100).toFixed(2),
        };
      });
      acc[poll.id] = optionsWithPercentages;
      return acc;
    }, {});

    setPollResults(results);
  };
  console.log(Posts);
  

  return (
    <div className="app">
      <h1 className='text-white text-center'>Home</h1>
      {loading ? (
        <div>Loading posts and polls...</div>
      ) : (
        <div className="feed">
          {/* Render Posts and Polls */}
          {Array.isArray(Posts) && Posts.length > 0 && (
            <div className="post-feed">
              {Posts.map((post) => (
                post.PostType === "Post" ? (
                  <PostCard key={post.id} post={post} />
                ) : post.PostType === "Poll" ? (
                  <PollCard
                    key={post.id}
                    poll={post}
                    onVote={handleVote}
                    votedOption={votedPolls[post.id]}
                    pollResults={pollResults[post.id]}
                  />
                ) : null
              ))}
            </div>
          )}

          {Array.isArray(Polls) && Polls.length > 0 && (
            <div className="poll-feed">
              {Polls.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  onVote={handleVote}
                  votedOption={votedPolls[poll.id]}
                  pollResults={pollResults[poll.id]}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
};

const PollCard = ({ poll, onVote, votedOption, pollResults }) => {
  return (
    <div className="poll-card">
      <h3>{poll.question}</h3>
      <div className="poll-options">
        {poll.options.map((option, index) => (
          <PollOption
            key={index}
            option={option}
            onVote={() => onVote(poll.id, option.text)}
            voted={votedOption === option.text}
            percentage={pollResults ? pollResults[index].percentage : 0}
            disabled={votedOption !== undefined} // Disable if an option is already selected
          />
        ))}
      </div>
      <div className="poll-footer">
        <button className="like-button">👍 Like</button>
        <button className="comment-button">💬 Comment</button>
      </div>
    </div>
  );
};

const PollOption = ({ option, onVote, voted, percentage, disabled }) => {
  return (
    <div
      className={`poll-option ${voted ? 'selected' : ''}`}
      onClick={!disabled ? onVote : undefined}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }} // Change cursor if disabled
    >
      <span>{option.text}</span>
      {voted && <span className="vote-indicator">✔</span>}
      {voted && <span className="percentage">{percentage}%</span>}
    </div>
  );
};

// CSS Styles for the component
const style = `
  .app {
    font-family: Arial, sans-serif;
    padding: 20px;
  }

  .feed {
    max-width: 800px;
    margin: 0 auto;
  }

  .post-card,
  .poll-card {
    background: white;
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .post-card h3,
  .poll-card h3 {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }

  .post-card p {
    font-size: 16px;
    color: #555;
  }

  .poll-options {
    margin: 10px 0;
  }

  .poll-option {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .poll-option:hover {
    background-color: #f1f1f1;
  }

  .poll-option.selected {
    background-color: #0073b1;
    color: white;
    border: 1px solid #0073b1;
  }

  .vote-indicator {
    margin-left: 10px;
    font-size: 16px;
  }

  .percentage {
    font-size: 14px;
    color: #555;
  }

  .poll-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  .like-button,
  .comment-button {
    background-color: #0073b1;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
  }

  .like-button:hover,
  .comment-button:hover {
    background-color: #005f8b;
  }
`;

// Inject the CSS styles into the head of the HTML
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = style;
document.head.appendChild(styleSheet);

export default Home;
