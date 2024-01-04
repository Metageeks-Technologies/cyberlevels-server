// cratering token and saving in cookie
import { Response } from "express";
export const sendTokenForAdmin = (user: any, statusCode: number, res: Response) => {
  const token = user.createJWT();
  // one day=24*60*60*1000
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    secure: false,
    // secure: process.env.NODE_ENV === 'production',
    // path: process.env.CLIENT_URL,
  };
  console.log("token", token);
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
export const sendToken = (user: any, statusCode: number, res: Response, accessToken?: string) => {
  let token = accessToken ? user.createJWT(accessToken) : user.createJWT();

  const options = {
    // httpOnly: process.env.NODE_ENV === 'production',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };
  console.log("token", options);
  res.status(statusCode).cookie("token", token, {

    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  }).json({
    success: true,
    token,
    user,
  });
};
