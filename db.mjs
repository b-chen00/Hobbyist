import * as mongoose from 'mongoose'; 

mongoose.connect('');

const User = new mongoose.Schema({
	name: String,
	hash: String,
    posts: Array,
    follows: Array,
    followers: Array,
});

const Post = new mongoose.Schema({
	user: String,
	content: String,
    comments: Array,
    createdAt: Date,
    likes: Array,
});

mongoose.model('User', User);
mongoose.model('Post', Post);
