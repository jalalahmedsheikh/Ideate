import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from '../socket/socket.js'


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
            .populate({ path: 'author', select: 'username profileImage' })
            .populate(
                {
                    path: 'comments', sort: { createdAt: -1 },
                    populate: {
                        path: 'author',
                        select: 'username profileImage'
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
  

export const likePost = async (req, res) => {
    try {
        const userLikeById = req.id
        const postId = req.params.id
        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }
        // like logic started
        await post.updateOne({ $addToSet: { likes: userLikeById } })
        await post.save();

        // implement socket io for real time notification
        const user = await User.findById(userLikeById).select('username profileImage')

        const postOwnerId = post.author.toString();
        if (postOwnerId !== userLikeById) {

            const notification = {
                type: "like",
                userId: userLikeById,
                userDetails: user,
                postId,
                message: `Your post "${post.caption.slice(0, 7)}..." was liked by ${user.name || user.username}.`
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId)
            io.to(postOwnerSocketId).emit('notification', notification)
        }

        return res.status(200).json({
            message: "Post liked",
            success: true
        })

    } catch (error) {
        console.log(error);

    }
}


export const dislikePost = async (req, res) => {
    try {
        const userLikeById = req.id
        const postId = req.params.id

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        // like logic started
        await post.updateOne({ $pull: { likes: userLikeById } })
        await post.save();

        // implement socket io for real time notification
        const user = await User.findById(userLikeById).select('username profileImage')
        const postOwnerId = post.author.toString();
        if(postOwnerId !== userLikeById){
            // emit a notification event
            const notification = {
                type: 'dislike',
                userId: userLikeById,
                userDetails: user,
                postId,
                message: `Your post "${post.caption.slice(0, 7)}..." was disliked by ${user.name || user.username}.`
            }            
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }
        return res.status(200).json({message:'Post disliked', success:true});

    } catch (error) {
        console.log(error);
        
    }
}

export const addComment = async (req,res) =>{
    try {
        const postId = req.params.id;
        const userCommentById = req.id;

        const {text} = req.body;

        const post = await Post.findById(postId);

        if(!text) return res.status(400).json({message:'text is required', success:false});

        const comment = await Comment.create({
            text,
            author:userCommentById,
            post:postId
        })

        await comment.populate({
            path:'author',
            select:"username profileImage"
        });
        
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message:'Comment Added',
            comment,
            success:true
        })
    } catch (error) {
     console.log(error);
        
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