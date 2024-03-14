const Comment = require('~/models/comment')

const commentService = {
  addComment: async (data) => {
    const { text, author, authorRole, cooperationId } = data

    return await Comment.create({ author, cooperation: cooperationId, text, authorRole })
  },

  getComments: async (cooperationId, userId) => {
    return await Comment.find({ cooperation: cooperationId, author: userId }).exec()
  }
}

module.exports = commentService
