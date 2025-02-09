import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resumes: [{ type: mongoose.Schema.Types.Mixed }], // To store user's resumes
});


const User = mongoose.model('Users', userSchema);
export default User;