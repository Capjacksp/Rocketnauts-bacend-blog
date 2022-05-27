import User from "../model/user";
import bcrypt from 'bcryptjs';
export const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "No users found" });
  }
  return res.status(200).json({ users });
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (existingUser) {
    return res.status(400).json({ message: "user alredy exist" });
  }
  const hashedpassword = bcrypt.hashSync(password);
  const user = new User({
    name,
    email,
    password:hashedpassword,
    blogs:[],
  });

  try {
    user.save();
  } catch (err){
     return console.log(err);
  }
  return res.status(201).json({ user });
};


export const login = async(req,res,next)=>{
    const {email , password} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({ email});
    }
    catch(err){
        return console.log(err);
    }

    if(!existingUser){
        return res.status(404).json({message:"User does not exist"});

    }
    const isPasswordCorract = bcrypt.compareSync(password,existingUser.password);
    if(isPasswordCorract){
        return res.status(200).json({message:"login success",user:existingUser})
    }else{
        return res.status(400).json({message:"invalid cradentials"});
    }

}