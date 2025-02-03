import jwt from 'jsonwebtoken';

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: '10d',
  });

  return res
    .status(200)
    .cookie('token', token,user._id, {
      httpOnly: false,
      sameSite: 'None',
      path: "/",
      maxAge: 10 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
    })
    .json({
      success: true,
      message,
      user,
    });

  console.log('Token cookie set:', res.getHeaders()); // Log headers for debugging

};
