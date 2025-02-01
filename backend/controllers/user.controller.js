import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'; // For password hashing
import { generateToken } from "../utills/genrateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utills/cloudinary.js";
import mongoose from "mongoose";

// 1. Register User: Registers a new user with location, category, and other details.
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate inputs
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user
    await newUser.save();

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ available: false }); // Username is taken
    }

    return res.status(200).json({ available: true }); // Username is available
  } catch (error) {
    console.error(error);
    return res.status(500).json({ available: false });
  }
};

// 2. Login User: Handles user login and generates a JWT token.
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found with this email.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    // Generate token and send response
    generateToken(res, user , `Welcome back ${user.username}`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// 3. Logout User: Logs out the user by clearing the token cookie.
export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// 4. Get User Profile: Fetches the profile of the logged-in user.
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;  // Ensure you are using req.params for route parameters
    
    // Check if userId is undefined
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Try to convert the userId to a valid ObjectId if necessary (it can happen if it's a string)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// 5. Update User Profile: Updates the user's profile (including photo and name).
export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Handle profile image update (remove old image from cloud and upload the new one)
    if (user.profileImage) {
      const publicId = user.profileImage.split("/").pop().split(".")[0];
      deleteMediaFromCloudinary(publicId);
    }

    const cloudResponse = await uploadMedia(profilePhoto);
    const photoUrl = cloudResponse.secure_url;

    const updatedData = { name, profileImage: photoUrl };
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// 6. Follow or Unfollow User: Manages following/unfollowing another user.
export const toggleFollow = async (req, res) => {
  try {
    const currentUserId = req.id;
    const { targetUserId, action } = req.body;

    if (!targetUserId || !action) {
      return res.status(400).json({
        success: false,
        message: "Target user ID and action type (follow/unfollow) are required.",
      });
    }

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow/unfollow yourself.",
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (action === "follow") {
      if (currentUser.followings.includes(targetUserId)) {
        return res.status(400).json({
          success: false,
          message: "You are already following this user.",
        });
      }

      currentUser.followings.push(targetUserId);
      targetUser.followers.push(currentUserId);

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        success: true,
        message: `You are now following ${targetUser.username}`,
      });
    }

    if (action === "unfollow") {
      if (!currentUser.followings.includes(targetUserId)) {
        return res.status(400).json({
          success: false,
          message: "You are not following this user.",
        });
      }

      currentUser.followings = currentUser.followings.filter(
        (id) => id.toString() !== targetUserId.toString()
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId.toString()
      );

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        success: true,
        message: `You have unfollowed ${targetUser.username}`,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid action type. Use 'follow' or 'unfollow'.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// 7. Suggested Users: Suggests users based on location and followers.
// export const suggestedUsers = async (req, res) => {
//   try {
//     const userId = req.id; // Assuming req.id contains the logged-in user's ID
//     const user = await User.findById(userId).select("location followers following");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     // Step 1: Exclude the logged-in user
//     let nearbyUsers = [];
//     if (user.location && user.location.coordinates) {
//       nearbyUsers = await User.find({
//         _id: { $ne: userId }, // Exclude the logged-in user
//         location: {
//           $geoWithin: { $centerSphere: [user.location.coordinates, 5 / 3963] }, // 5 miles radius
//         },
//       }).limit(5); // Limit the number of nearby users to 5
//     }

//     // Step 2: Get users suggested based on followers' following list
//     let suggestedUsers = [];
//     const followersOfUser = await User.find({ _id: { $in: user.followers } });

//     followersOfUser.forEach(follower => {
//       suggestedUsers = [...suggestedUsers, ...follower.following];
//     });

//     // Step 3: Exclude already followed users and the logged-in user
//     suggestedUsers = suggestedUsers.filter(id => !user.following.includes(id) && id !== userId);

//     // Remove duplicates from the suggested users list
//     suggestedUsers = [...new Set(suggestedUsers)];

//     // Step 4: Fetch users based on the suggested user IDs
//     const finalSuggestedUsers = await User.find({ _id: { $in: suggestedUsers } });

//     // Step 5: Combine the nearby users with the final suggested users list
//     const finalUsersList = [...new Set([...nearbyUsers.map(u => u._id), ...finalSuggestedUsers.map(u => u._id)])];

//     // Step 6: Fetch the complete data for the final list of suggested users
//     const finalUsers = await User.find({ _id: { $in: finalUsersList } });

//     return res.status(200).json({
//       success: true,
//       message: "Suggested users fetched successfully.",
//       users: finalUsers,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error.",
//     });
//   }
// };
export const suggestedUsers = async (req, res) => {
  try {
      // Get the logged-in user's ID from the request (assuming it's passed in the request body or JWT token)
      const loggedInUserId = req.id;  // Or req.body.userId depending on how it's passed
      
      // Fetch verified users, excluding the logged-in user
      const verifiedUsers = await User.find({ _id: { $ne: loggedInUserId }, isverified: true })
          .select('username profileImage isverified followers followings category')  // Only select necessary fields
          .limit(10);  // Limit to 10 users (adjust as needed)

      // Fetch non-verified users, excluding the logged-in user
      const nonVerifiedUsers = await User.find({ _id: { $ne: loggedInUserId }, isverified: false })
          .select('username profileImage isverified followers followings category')  // Only select necessary fields
          .limit(10);  // Limit to 10 users (adjust as needed)

      // Concatenate verified and non-verified users, placing verified users first
      const suggestedUsers = [...verifiedUsers, ...nonVerifiedUsers];

      return res.status(200).json({
          suggestedUsers,
          success: true
      });
  } catch (error) {
      console.error("Error fetching suggested users:", error);
      return res.status(500).json({
          success: false,
          message: "Error fetching suggested users"
      });
  }
};




