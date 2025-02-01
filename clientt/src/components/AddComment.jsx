import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { noop } from 'framer-motion';

const AddComment = ({ addNewComment }) => {
  const { id } = useParams(); // Get postId from the URL
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    const token = Cookies.get('token');
    
    
    // if (!token) {
    //   setError('You need to be logged in to comment');
    //   return;
    // }

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8000/post/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText }),
      });

      const data = await response.json();
      if (data.success) {
        addNewComment(data.comment); // Call the parent function to update the comments list
        setCommentText('');
      } else {
        setError(data.message || 'Failed to post comment');
      }
    } catch (error) {
      setError('Error posting comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.commentSection}>
      <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
        <textarea 
          type="text"
          value={commentText}
          onChange={handleCommentChange}
          className='bg-dark text-white'
          placeholder="Add a comment..."
          style={styles.commentInput}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className='btn bg-white text-dark mt-5' style={styles.commentButton} disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};

const styles = {
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
    minHeight: '80px',
    fontSize: '14px',
    resize:'none'
  },
  commentButton: {
  },
};

export default AddComment;
