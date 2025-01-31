import React from 'react';
import { FaHeart, FaComment, FaUserPlus, FaUserCircle } from 'react-icons/fa'; // Icons for like, comment, and follow
import { formatDistanceToNow } from 'date-fns'; // To display relative timestamps like "2 minutes ago"
import styled from 'styled-components';

// Sample notification data (replace with real API data)
// const notifications = [
//   {
//     id: 1,
//     type: 'like',
//     username: 'user1',
//     postTitle: 'Awesome dance video!',
//     timestamp: new Date() - 10000, // 10 seconds ago
//   },
//   {
//     id: 2,
//     type: 'comment',
//     username: 'user2',
//     postTitle: 'Great vlog!',
//     timestamp: new Date() - 3600000, // 1 hour ago
//     comment: 'This is amazing!',
//   },
//   {
//     id: 3,
//     type: 'follow',
//     username: 'user3',
//     timestamp: new Date() - 86400000, // 1 day ago
//   },
// ];

// Styled components for the Notifications page
const NotificationsContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  height: 100vh;
  overflow-y: auto;
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationCard = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 10px;
`;

const NotificationInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const NotificationDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Username = styled.span`
  font-weight: bold;
  font-size: 14px;
  color: #333;
`;

const ActionText = styled.span`
  font-size: 12px;
  color: #555;
`;

const CommentText = styled.span`
  font-style: italic;
  font-size: 12px;
  color: #444;
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: #999;
`;

const PostPreview = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PostTitle = styled.p`
  font-size: 14px;
  color: #333;
  margin: 0;
`;

const ActionIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Icon = styled.div`
  font-size: 20px;
  color: #999;
  margin-left: 10px;
  cursor: pointer;

  &:hover {
    color: #1da1f2;
  }
`;

const Notifications = () => {
  return (
    <NotificationsContainer className='bg-dark'>
      <h1 className='text-center mb-5 sticky-top'>Updates</h1>
      <NotificationsList>
        {/* {notifications.map((notification) => (
          <NotificationCard key={notification.id}>
            <NotificationInfo>
              <FaUserCircle/>
              <NotificationDetails>
                <Username>{notification.username}</Username>
                <ActionText>
                  {notification.type === 'like' && 'liked your post: '}
                  {notification.type === 'comment' && 'commented on your post: '}
                  {notification.type === 'follow' && 'started following you'}
                </ActionText>
                {notification.type === 'comment' && (
                  <CommentText>"{notification.comment}"</CommentText>
                )}
                <Timestamp>
                  {formatDistanceToNow(notification.timestamp)} ago
                </Timestamp>
              </NotificationDetails>
            </NotificationInfo>
            <PostPreview>
              {notification.type !== 'follow' && (
                <PostTitle>{notification.postTitle}</PostTitle>
              )}
            </PostPreview>
            <ActionIcons>
              {notification.type === 'like' && <FaHeart />}
              {notification.type === 'comment' && <FaComment />}
              {notification.type === 'follow' && <FaUserPlus />}
            </ActionIcons>
          </NotificationCard>
        ))} */}
        <p className='text-center'>All Notifications will show here.</p>
      </NotificationsList>
    </NotificationsContainer>
  );
};

export default Notifications;
