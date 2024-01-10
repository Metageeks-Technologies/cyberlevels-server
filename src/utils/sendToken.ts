// cratering token and saving in cookie
import { Response } from "express";

export const sendTokenForAdmin = (user: any, statusCode: number, res: Response) => {
  const token = user.createJWT();
  // one day=24*60*60*1000
  const options = {
    httpOnly: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  };
  console.log("token", token);
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

export const sendToken = (user: any, statusCode: number, res: Response, accessToken?: string) => {
  let token = accessToken ? user.createJWT({accessToken,provider:user.provider}) : user.createJWT();

  const options = {
    httpOnly: process.env.NODE_ENV === 'production',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
