import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Get the token from cookies
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the 'Authorization' header

    // Check if the token is not found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found. Please login to proceed.",
      });
    }

    // Verify the token using the secret key
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    // If the token is invalid or expired
    if (!verifyToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please login again.",
      });
    }

    // Attach the user ID to the request object for use in subsequent routes
    req.id = verifyToken.userId;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Log the error and send a response with status 500 if something goes wrong
    console.error('Authentication error:', error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying the token. Please try again later.",
    });
  }
};

export default isAuthenticated;




