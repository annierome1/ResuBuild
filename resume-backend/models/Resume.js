import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    username: { type: String, required: true }, 
    resumeName: { type: String, required: true }, 
    userObject: { type: Object, required: true } 
});

const Resume = mongoose.model('Resume', resumeSchema, 'Resumes');
export default Resume;
