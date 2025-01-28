import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PostPage = () => {
  const location = useLocation();  // Get the location object from the hook
  const { postId } = location.state || {};  // Access the postId from the state
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the post data when the component mounts or postId changes
  useEffect(() => {
    if (postId) {
      axios
        .get(`http://localhost:8000/post/${postId}`)
        .then((response) => {
          setPost(response.data.post);
          setLoading(false);
        })
        .catch((error) => {
          setError("Failed to fetch post data.");
          setLoading(false);
        });
    }
  }, [postId]);  // Dependency on postId

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {post && (
        <div>
          <h1>{post.caption}</h1>
          <p>{post.content}</p>
          {/* You can display more details about the post here */}
        </div>
      )}
    </div>
  );
};

export default PostPage;
