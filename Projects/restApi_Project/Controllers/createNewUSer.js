import User from "../models/user.js"

async function createNewUser(req, res) {
    const body = req.body;
    if(
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.age ||
        !body.gender
    ){
        return res.status(400).json({Message: "All fields are required...."})
    }
    const result = await User.create({
        first_name: body.first_name,
        last_name: body.last_name,
        age: body.age,
        gender: body.gender
    })

    return res.status(201).json({Message: "User Created Successfully !!!", id: result._id})
}

export default createNewUser;

