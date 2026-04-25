const express = require("express"); 

const{
    registerUser,
    loginUser,
    getUser,
} =require ("../../controllers/user/user.controller");
const auth = require("../../middlewares/auth.middleware");

const userRouter = express.Router();

userRouter.post("/register", registerUser);                             
userRouter.post("/login", loginUser);
userRouter.get("/me", auth, getUser);


module.exports = userRouter;


