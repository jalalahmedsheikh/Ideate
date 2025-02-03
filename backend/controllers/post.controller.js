import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from '../socket/socket.js'
import mongoose from "mongoose";


export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body
        const authorId = req.id

        if (!caption) {
            return res.status(400).json({
                success: false,
                message: "Caption field cannot be empty."
            })
        }
        const post = await Post.create({
            caption,
            author: authorId
        })

        const userr = await User.findById(authorId)
        if (userr) {
            userr.posts.push(post._id)
            await userr.save()
        }

        await post.populate({ path: 'author', select: '-password' })

        return res.status(201).json({
            success: true,
            post,
            message: "New post added."
        })

    } catch (error) {
        console.log(error);

    }
}


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profileImage isverified' })
            .populate(
                {
                    path: 'comments', sort: { createdAt: -1 },
                    populate: {
                        path: 'author',
                        select: 'username profileImage isverified'
                    }
                });
        
        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching posts"
        });
    }
};

// Controller to fetch a single post by its ID
export const getSinglePost = async (req, res) => {
    try {
        const { id } = req.params;  // Get the post ID from the request parameters

        // Validate the ID (optional but recommended)
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required"
            });
        }

        // Find the post by ID, and populate the required fields
        const post = await Post.findById(id)
            .populate({ path: 'author', select: '-password' })
            .populate(
                {
                    path: 'comments', sort: { createdAt: -1 },
                    populate: {
                        path: 'author',
                        select: '-password'
                    }
                });

        // If the post doesn't exist, send a 404 error
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Return the post data if found
        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.error("Error fetching post:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching post"
        });
    }
};


export const getAllPostsOfFollowing = async (req, res) => {
    try {
        const loggedInUserId = req.id;  // Assuming the logged-in user's ID is available in `req`
        
        // Fetch the logged-in user's data, including the list of followed users
        const user = await User.findById(loggedInUserId).populate('following');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const followingIds = user.followings.map(followedUser => followedUser._id);
        
        // Query posts from followed users, sorted by creation date
        const posts = await Post.find({ author: { $in: followingIds } })
            .sort({ createdAt: -1 })  // Sort by creation date, latest first
            .populate({ path: 'author', select: 'username profileImage isVerified' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profileImage isVerified',
                },
            });

        return res.status(200).json({
            success: true,
            posts,
        });

    } catch (error) {
        console.error('Error fetching posts of following:', error.message || error);
        return res.status(500).json({
            success: false,
            message: 'There was an issue retrieving posts of users you follow. Please try again later.',
        });
    }
};


export const getUserPosts = async (req, res) => {
    try {
      const authorId = req.id; // Assuming `req.id` is coming from a verified user token
      if (!authorId) {
        return res.status(400).json({
          success: false,
          message: 'Author ID is required.',
        });
      }
  
      // Fetching posts of the given authorId
      const posts = await Post.find({ author: authorId })
        .sort({ createdAt: -1 }) // Sorting posts by creation date in descending order
        .populate({
          path: 'author',
          select: 'username profileImage', // Populating the author's username and profileImage
        })
        .populate({
          path: 'comments',
          sort: { createdAt: -1 }, // Sorting comments by creation date in descending order
          populate: {
            path: 'author',
            select: 'username profileImage', // Populating the comment author's username and profileImage
          },
        });
  
      if (!posts || posts.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No posts found for this user.',
        });
      }
  
      return res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching user posts.',
      });
    }
  };
  
  export const toggleLikePost = async (req, res) => {
    try {
      const postId = req.params.id; // Post ID from the URL parameter
      const userId = req.id; // Logged-in user ID
  
      // Find the post by its ID
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Ensure post.likes is always an array
      if (!Array.isArray(post.likes)) {
        post.likes = []; // Fallback to an empty array if post.likes is null or not an array
      }
  
      // Ensure userId is a valid object ID
      if (!userId) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
  
      // Check if the user has already liked the post
      if (post.likes.includes(userId)) {
        // If the user has liked the post, remove the like (unlike)
        post.likes = post.likes.filter((like) => {
          return like && like.toString() !== userId.toString(); // Ensure `like` is valid and not null
        });
        await post.save();
        return res.status(200).json({ message: "Post unliked successfully", liked: false });
      } else {
        // If the user hasn't liked the post, add the like
        post.likes.push(userId);
        await post.save();
        return res.status(200).json({ message: "Post liked successfully", liked: true });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  



export const getOtherUserPosts = async (req, res) => {
    const userId  = req.params.id; // Get the userId from URL parameters
    try {
        // Validate if the userId is a valid ObjectId
        if (! mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: "Invalid user ID" });
        }
    
        // Fetch posts authored by the user
        const posts = await Post.find({ author: userId }).sort({ createdAt: -1 }); // Sorting by creation date
    
        // Check if the user has posts
        if (posts.length === 0) {
          return res.status(404).json({ message: "No posts found for this user." });
        }
    
        // Return the posts
        return res.status(200).json({ posts });
      } catch (error) {
        console.error("Error fetching posts: ", error);
        return res.status(500).json({ message: "Error fetching posts. Please try again later." });
      }
}


export const addComment = async (req,res) =>{
    try {
        const { postId } = req.params;  // Get the post ID from URL parameters
        const { content } = req.body;   // Get the comment content from request body
        const userId = req.id;     // Assuming you store the user ID in req
    
        // Validate comment content
        if (!content || content.trim() === '') {
          return res.status(400).json({ success: false, message: 'Comment content cannot be empty.' });
        }
    
        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ success: false, message: 'Post not found.' });
        }
    
        // Create a new comment
        const newComment = new Comment({
          content,
          author: userId,   // Assuming Comment has an `author` field for the user
          post: postId      // Link comment to the specific post
        });
    
        // Save the comment to the database
        await newComment.save();
    
        // Add the comment ID to the post's comments array
        post.comments.push(newComment._id);
        await post.save();
    
        // Return the newly created comment
        res.status(201).json({
          success: true,
          comment: newComment,
          message: "Comment posted successfully"
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
      }
}

export const getCommentsOfPost = async (req,res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({post:postId}).populate('author', 'username profileImage');

        if(!comments) return res.status(404).json({message:'No comments found for this post', success:false});

        return res.status(200).json({success:true,comments});

    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (req,res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});

        // check if the logged-in user is the owner of the post
        if(post.author.toString() !== authorId) return res.status(403).json({message:'Unauthorized'});

        // delete post
        await Post.findByIdAndDelete(postId);

        // remove the post id from the user's post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // delete associated comments
        await Comment.deleteMany({post:postId});

        return res.status(200).json({
            success:true,
            message:'Post deleted'
        })

    } catch (error) {
        console.log(error);
    }
}

export const SavePost = async (req,res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});
        
        const user = await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            // already saved -> remove from the save posts
            await user.updateOne({$pull:{saved:post._id}});
            await user.save();
            return res.status(200).json({type:'unsaved', message:'Post removed from saved posts', success:true});

        }else{
            // bookmark krna pdega
            await user.updateOne({$addToSet:{saved:post._id}});
            await user.save();
            return res.status(200).json({type:'saved', message:'Post saved', success:true});
        }

    } catch (error) {
        console.log(error);
    }
}

// Share Post
export const sharePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;

        const post = await Post.findById(postId)
            .populate({ path: 'author', select: 'username' });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found.',
            });
        }

        const user = await User.findById(userId).select('username profileImage');

        const shareData = {
            postUrl: `http://localhost:3000/posts/${post._id}`,
            caption: post.caption,
            sharedBy: user.username,
            userProfileImage: user.profileImage,
            postOwner: post.author.username,
        };

        const notification = {
            type: 'share',
            userId: userId,
            postId: postId,
            message: `${user.username} shared your post "${post.caption.slice(0, 7)}..."`,
        };

        const postOwnerSocketId = getReceiverSocketId(post.author._id.toString());
        io.to(postOwnerSocketId).emit('notification', notification);

        return res.status(200).json({
            success: true,
            message: 'Post shared successfully!',
            shareData,
        });
    } catch (error) {
        console.error("Error sharing post:", error);
        return res.status(500).json({
            success: false,
            message: 'Error sharing post.',
        });
    }
}

