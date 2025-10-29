

import React from 'react';
import type { Post } from '../types';
import { UpvoteIcon, CommentIcon } from './Icons';

// Fix: Added PostCardProps interface
interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-secondary rounded-lg p-6 mb-4 shadow-md transition-shadow hover:shadow-xl">
      <div className="flex items-start">
        <div className="flex flex-col items-center mr-4 text-text-secondary">
          <button className="hover:text-accent"><UpvoteIcon className="w-6 h-6" /></button>
          <span className="font-bold text-lg my-1 text-text-primary">{post.upvotes}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center text-sm text-text-secondary mb-2">
            <span>Posted by <span className="font-semibold text-text-primary">{post.author}</span></span>
            <span className="mx-2">•</span>
            <span>{post.timestamp}</span>
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-3">{post.title}</h3>
          <p className="text-text-secondary leading-relaxed">{post.content}</p>
          <div className="mt-4">
            <button className="flex items-center text-sm text-text-secondary hover:text-accent transition-colors">
              <CommentIcon className="w-5 h-5 mr-2" />
              {post.comments} Comments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
