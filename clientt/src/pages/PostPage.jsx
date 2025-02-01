import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUserCircle, FaRegHeart, FaHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import verifiedBadge from '../assets/images/verified.png';
import AddComment from '../components/AddComment';

const theme = {
  primary: 'rgb(40, 0, 65)',
  secondary: '#fd1d1d',
  lightGray: 'dark',
};

const PostPage = () => {
  const { id } = useParams(); // Retrieve the post ID from the URL
  const [post, setPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  // Fetch the post and its comments
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8000/post/${id}`);
        const data = await response.json();
        setPost(data.post);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    // Fetch all comments for the post
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8000/post/${id}/comment/all`);
        const data = await response.json();
        setComments(data.comments || []); // Set the comments for the post
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const toggleLike = (postId) => {
    setLikedPosts((prevLikedPosts) => ({
      ...prevLikedPosts,
      [postId]: !prevLikedPosts[postId],
    }));
  };

  const toggleSave = (postId) => {
    setSavedPosts((prevSavedPosts) => ({
      ...prevSavedPosts,
      [postId]: !prevSavedPosts[postId],
    }));
  };

  const formatTimeAgo = (date) => {
    const time = new Date(date);
    const now = new Date();
    const diff = now - time;

    const minutes = Math.floor(diff / 1000 / 60);
    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(diff / 1000 / 60 / 60);
    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(diff / 1000 / 60 / 60 / 24);
    return `${days} days ago`;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return; // Prevent submitting if the comment is empty

    const newComment = {
      content: commentText,
    };

    try {
      const response = await fetch(`http://localhost:8000/post/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });

      const data = await response.json();
      if (data.success) {
        // Assuming the API response returns the updated list of comments
        setComments((prevComments) => [...prevComments, data.comment]);
        setCommentText(''); // Clear the input field
      } else {
        console.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (!post) {
    return <div>Loading...</div>; // Show loading message if post is still being fetched
  }

  return (
    <div key={post._id} style={styles.cardContainer} className="border">
      <div style={styles.cardHeader}>
        <Link className="user-select-none text-decoration-none text-white" to={`/profile/${post.author._id}`} style={styles.username}>
          <div>
            {post.author.profileImage ? (
              <img src={post.author.profileImage} alt={post.author.username} />
            ) : (
              <FaUserCircle className="fs-1 me-2" />
            )}
          </div>
        </Link>
        <div className="w-100">
          <Link className="user-select-none text-decoration-none text-white" to={`/profile/${post.author._id}`} style={styles.username}>
            {post.author.username || 'Ideate-user'}
            {post.author.isverified && (
              <img
                src={verifiedBadge}
                alt="Verified"
                style={{ width: '20px', height: '15px', marginLeft: '3px', verticalAlign: 'middle' }}
              />
            )}
          </Link>
          <div style={styles.footer}>
            <span>{formatTimeAgo(post.createdAt)}</span> {/* Display the formatted time */}
          </div>
        </div>
      </div>
      <div style={styles.cardImage}>
        <h5>{post.caption}</h5>
      </div>
      <div style={styles.cardActions} className="user-select-none">
        <div
          onClick={() => toggleLike(post._id)}
          style={{
            ...styles.actionButton,
            animation: likedPosts[post._id] ? 'shake 0.5s ease-in-out' : 'none',
          }}
        >
          <span
            style={{
              ...styles.icon,
              color: likedPosts[post._id] ? theme.primary : theme.secondary,
            }}
          >
            {likedPosts[post._id] ? <FaHeart /> : <FaRegHeart className="text-white" />}
          </span>
          <span>{likedPosts[post._id] ? 'Liked' : 'Like'}</span>
        </div>
        <Link style={styles.actionButton} className=" user-select-none text-decoration-none text-white">
          <span style={styles.icon}>
            <i className="fa-regular fa-comment"></i>
          </span>
          <span>Comment</span>
        </Link>
        <div onClick={() => toggleSave(post._id)} style={styles.actionButton}>
          <span style={styles.icon}>
            {savedPosts[post._id] ? <FaBookmark /> : <FaRegBookmark />}
          </span>
          <span>{savedPosts[post._id] ? 'Saved' : 'Save'}</span>
        </div>
      </div>
      <div style={styles.cardContent}>
        <span style={styles.likesCount}>{`${post.likes.length} Likes`}</span>
      </div>

      {/* Display all comments */}
      <div style={styles.commentsList}>
        {comments.length > 0 ?comments.map((comment, index) => (
          <div key={index} style={styles.commentItem}>
          <strong>{comment.author.username}</strong>: {comment.content}
          <br />
          <small>{formatTimeAgo(comment.createdAt)}</small>
          </div>
        )) :<p className='text-center'>No comments in this post yet.</p>
      }
      </div>

      {/* Comment Section */}
      <AddComment></AddComment>
    </div>
  );
};

const styles = {
  cardContainer: {
    width: '100%',
    maxWidth: '500px',
    margin: '20px auto',
    backgroundColor: theme.lightGray,
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
  },
  username: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  cardImage: {
    width: '100%',
    overflow: 'hidden',
    padding: '25px',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 15px',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },
  icon: {
    fontSize: '20px',
    marginRight: '5px',
  },
  cardContent: {
    padding: '10px 15px',
  },
  likesCount: {
    fontWeight: 'bold',
  },
  footer: {
    fontSize: '12px',
    color: '#888',
  },
  commentSection: {
    padding: '10px 15px',
    borderTop: '1px solid #ddd',
  },
  commentForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  commentInput: {
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    minHeight: '40px',
    fontSize: '14px',
  },
  commentButton: {
    alignSelf: 'flex-start',
    padding: '5px 15px',
    backgroundColor: theme.primary,
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  commentsList: {
    marginTop: '20px',
  },
  commentItem: {
    marginBottom: '10px',
    fontSize: '14px',
  },
};

export default PostPage;
