import * as mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';

mongoose.connect('mongodb+srv://bchen00:0vy9b3UsWfwT6C1z@hobbist.r2own3d.mongodb.net/?retryWrites=true&w=majority');



const UserSchema = new mongoose.Schema({
	name: String,
	hash: {type: String, required: true},
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    follows: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

const PostSchema = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	content: String,
	category: String,
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    createdAt: Date,
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

const CommentSchema = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	content: String,
	post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

UserSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=name%>-<%=hash%>-<%=posts%>-<%=follows%>-<%=followers%>'});
mongoose.model('User', UserSchema);

PostSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=user%>-<%=content%>-<%=category%>-<%=comments%>-<%=createdAt%>-<%=likes%>'})
mongoose.model('Post', PostSchema);

CommentSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=user%>-<%=content%>-<%=post%>'});
mongoose.model('Comment', CommentSchema);
