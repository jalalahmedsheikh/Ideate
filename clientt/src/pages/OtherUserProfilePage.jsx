import { useEffect, useState } from "react";
import axiosInstance from './axiosInstance';
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import verifiedBadge from '../assets/images/verified.png';  // Import the verified badge image
import axios from "axios";

// Global Styles
const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', sans-serif;
    background-color:rgb(37, 37, 37);
    color: white;
    overflow-x: hidden;
  }
`;

// Theme
const theme = {
  primary: "rgb(40, 0, 65)",
  secondary: "#fd1d1d",
  lightGray: "#f1f1f1",
};

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #000, rgb(40, 0, 65));
  color: white;
  padding: 1rem 2rem 2rem 2rem;
  border-radius: 0 0 20px 20px;
  width: 100%;
`;

const Avatar = styled.div`
  margin-top: -50px;
  font-size: 100px;

  @media (max-width: 768px) {
    font-size: 80px;
  }
`;

const Info = styled.div`
  text-align: center;
  margin-top: 10px;

  h1 {
    font-size: 2rem;
    margin: 0.5rem 0;
  }

  p {
    font-size: 1rem;
    opacity: 0.8;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;

  div {
    text-align: center;

    span {
      font-weight: bold;
      font-size: 1.2rem;
    }

    p {
      font-size: 0.9rem;
    }
  }
`;

const TabsContainer = styled.div`
  margin: 2rem;
  width: 100%;
`;

const TabsHeader = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;

  button {
    padding: 0.5rem 1.5rem;
    border: none;
    background: gray;
    color: white;
    font-size: 1rem;
    border-radius: 20px;
    cursor: pointer;
    transition: 0.3s ease;

    &:hover {
      background: ${(props) => props.theme.primary};
    }

    &.active {
      background: ${(props) => props.theme.primary};
      font-weight: bold;
    }
  }
`;

const Content = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 0 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);  // 3 items per row on mobile devices
  }
`;

const Card = styled.div`
  background: #000;
  border-radius: 10px;
  padding: 1rem;
  color: white;
  position: relative;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: scale(1.05);
    transition: all 0.3s ease;
  }
`;

export default function OtherUserProfilePage() {
  const { id } = useParams(); // Retrieve the User ID from the URL
  const [user, setUser] = useState(null);  // Store user data
  const [userPosts, setUserPosts] = useState([]);  // Store posts data
  const [error, setError] = useState(null);  // Store any error messages
  const [activeTab, setActiveTab] = useState("Ideas");
  console.log(id);



  useEffect(() => {
    // Fetch profile data for the other user
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user/profile/${id}`);  // API to get other user's profile
        setUser(response.data.user);  // Set user data in sta

      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('User not found.');
        } else {
          setError('An error occurred. Please try again later or refresh');
        }
      }
    };

    // Fetch the other user's posts
    const fetchUserPosts = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:8000/post/userpost/all/${id}`);  // API to get user posts
        setUserPosts(response.data.posts);  // Set posts data in state
      } catch (err) {
        console.error("Error fetching user posts:", err);
      }
    };

    fetchProfile();
    fetchUserPosts();  // Fetch posts when the component mounts
  }, [id]);  // Dependency array includes userId so the effect runs when userId changes

  if (error) {
    return (
      <div className="text-center text-danger">
        {error}
        <div className="errorBtn mt-5">
          <a href="/" className=" bg-white rounded p-2 text-dark text-decoration-none">Go back</a>
        </div>
      </div>
    );  // Display any error messages
  }

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <PageContainer>
          <GlobalStyles />
          {/* Profile Header */}
          <HeaderContainer>
            <h4 className="mb-5 text-uppercase ">
              <a href="" className="text-decoration-none text-white text-center">
                name
              </a>
            </h4>
            <Avatar>
              <FaUserCircle />
            </Avatar>
            <Info>
              <h4>
                <a href="" className="text-decoration-none text-white text-center">
                  @username
                </a>
              </h4>
              <p>Bio...</p>
              <Link
                to={''}
                className="w-100 btn rounded-pill text-white border-light px-3"
                style={{ backgroundColor: theme.primary }}
              >
                Follow{" "}
                <i className="fa-solid fa-pen ms-1" style={{ fontSize: "15px" }}></i>
              </Link>
            </Info>
            <Stats>
              <a href="" className="user-select-none text-center text-decoration-none text-white">
                <span>--</span>
                <p>Followers</p>
              </a>
              <a href="" className="user-select-none text-center text-decoration-none text-white">
                <span>--</span>
                <p>Following</p>
              </a>
              <a href="" className="user-select-none text-center text-decoration-none text-white">
                <span>--</span>
                <p>Posts</p>
              </a>
            </Stats>
          </HeaderContainer>

          {/* Tabs and Content */}
          <TabsContainer>
            <TabsHeader className="sticky-top">
              <button>My Ideas</button>
              <button>Liked</button>
              <button>Saved</button>
            </TabsHeader>
            <Content></Content>
          </TabsContainer>
        </PageContainer>
      </ThemeProvider>
    );
  }

  const tabs = ["Ideas", "Liked", "Saved"];
  const soonTab = { caption: 'Comming soon' }


  const renderContent = () => {
    const postsData =
      activeTab === "Ideas"
        ? userPosts
        : activeTab === "Liked"
          ? [soonTab]
        : activeTab === "Saved"
          ? [soonTab]
          : [];

    return postsData.map((post) => (
      <>
        {post.caption === 'Comming soon' ? <p className="user-select-none text-center mt-5">{post.caption}</p> :
          <Card key={post._id}>
            <Link className="user-select-none text-decoration-none py-5 text-white" to={`/post/${post._id}`}>
              <p className="user-select-none">{post.caption.length > 15 ? `${post.caption.slice(0, 15)}...` : post.caption}</p>
              {/* You can add more details from the post object here */}
            </Link>
          </Card>
        }
      </>
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <PageContainer>
        <GlobalStyles />
        {/* Profile Header */}
        <HeaderContainer>
          <h4 className="mb-5 text-uppercase ">
            <a href="" className="text-decoration-none text-white text-center">
              {user.name || "Unknown"}
            </a>
          </h4>
          <Avatar>
            <FaUserCircle />
          </Avatar>
          <Info>
            <h4>
              <a href="" className="text-decoration-none text-light text-center">
                @{user.username}
                {user.isverified && (
                  <img
                    src={verifiedBadge}
                    alt="Verified"
                    style={{ width: '25px', height: '20px', marginLeft: '5px', verticalAlign: 'middle' }}
                  />
                )}
              </a>
            </h4>
            <span>A {user.category}</span>
            <p>{user.bio}</p>
            <Link
              className="w-100 btn rounded-pill text-white border-light px-3"
              style={{ backgroundColor: theme.primary }}
            >
              Follow
            </Link>
          </Info>
          <Stats>
            <a href="" className="user-select-none text-center text-decoration-none text-white">
              <span>{user.followers.length}</span>
              <p>Followers</p>
            </a>
            <a href="" className="user-select-none text-center text-decoration-none text-white">
              <span>{user.followings.length}</span>
              <p>Following</p>
            </a>
            <a href="" className="user-select-none text-center text-decoration-none text-white">
              <span>{userPosts.length}</span>
              <p>Posts</p>
            </a>
          </Stats>
        </HeaderContainer>

        {/* Tabs and Content */}
        <TabsContainer>
          <TabsHeader className="sticky-top">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "active border" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </TabsHeader>
          <Content
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderContent()}
          </Content>
        </TabsContainer>
      </PageContainer>
    </ThemeProvider>
  );
}
