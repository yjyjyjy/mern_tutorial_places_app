const HttpError = require("../models/http-error");
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const dlog = require("../util/log");

// let DUMMY_USERS = [
//   {
//     id: "u1",
//     name: "Junyu Yang",
//     email: "prowessyang@gmail.com",
//     password: "password",
//   },
//   {
//     id: "u2",
//     name: "John Wick",
//     email: "babayaga@gmail.com",
//     password: "mydog",
//   },
// ];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError(`Failed to retrieve all users: ${err}`, 500));
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid Input passed.", 422));
  }

  const { name, email, password} = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError(
        `Failed to validate if there is an existing user while sign up: ${err}`,
        500
      )
    );
  }

  if (existingUser) {
    return next(new HttpError("user email already registered", 401));
  }

  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://www.indiewire.com/wp-content/uploads/2016/10/john-wick-chapter-2.jpg",
    places:[] // start with empty array.
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError(`Can't save user ${err}`, 500));
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid Input passed.", 422));
  }

  if (!req.body.email || !req.body.password) {
    return next(new HttpError("invalid login request", 404));
  }

  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email, password: password });
  } catch (err) {
    return next(
      new HttpError(`Failed to retrieve user data during sign in: ${err}`, 500)
    );
  }

  if (!user) {
    return next(new HttpError("Incorrect email or password.", 401));
  }

  res.status(200).json({ message: "Success! User logged in." });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
