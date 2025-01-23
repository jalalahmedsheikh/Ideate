import { useState } from "react";
import axiosInstance from "./axiosInstance"; // Ensure axiosInstance is correctly set up
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Cookies from "js-cookie"; // Import js-cookie

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  padding: 20px;
  background-color: #1a1a1a;
  border-radius: 10px;
  width: 60%;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: white;
  margin-bottom: 20px;
`;

const FormContainer = styled.form`
  width: 100%;
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #333;
  color: white;
`;

const TextArea = styled.textarea`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #333;
  color: white;
  min-height: 150px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #fd1d1d;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ff3333;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  margin-bottom: 15px;
  font-weight: bold;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  margin-bottom: 15px;
  font-weight: bold;
`;

export default function CreatePost() {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError(null);
    setSuccess(null);

    // Check if caption is empty
    if (!caption) {
      setError("Caption is required!");
      return;
    }

    const postData = caption;

    try {

      const config = {
        headers: {
          "Content-Type": "form-data",
        },
      };

      const response = await axiosInstance.post(
        "http://localhost:8000/post/createPost",
        postData,
        config
      );

      if (response.status === 200) {
        setSuccess("Post created successfully!");
        setTimeout(() => navigate("/profile"), 2000); // Redirect to profile after success
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again later.");
    }
  };

  return (
    <PageContainer>
      <Title>Create a New Post</Title>
      
      {/* Show success or error messages */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <FormContainer onSubmit={handleSubmit}>
        {/* Caption input */}
        <TextArea
          placeholder="Write your caption here..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Submit button */}
        <Button type="submit">Create Post</Button>
      </FormContainer>
    </PageContainer>
  );
}
