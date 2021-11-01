const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.postThreadCommentReplyHandler = this.postThreadCommentReplyHandler.bind(this);
    this.putThreadCommentLikeHandler = this.putThreadCommentLikeHandler.bind(this);
    this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
    this.deleteThreadCommentReplyHandler = this.deleteThreadCommentReplyHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async putThreadCommentLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);

    await likeCommentUseCase.execute({
      ...request.payload,
      threadId,
      commentId,
      ownerId: request.auth.credentials.id,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async postThreadCommentReplyHandler(request, h) {
    const { threadId, commentId } = request.params;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

    const addedReply = await addReplyUseCase.execute({
      ...request.payload,
      threadId,
      commentId,
      ownerId: request.auth.credentials.id,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentReplyHandler(request, h) {
    const { replyId } = request.params;
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);

    await deleteReplyUseCase.execute({
      replyId,
      ownerId: request.auth.credentials.id,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute({ threadId });

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({
      ...request.payload,
      ownerId: request.auth.credentials.id,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postThreadCommentHandler(request, h) {
    const { threadId } = request.params;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const addedComment = await addCommentUseCase.execute({
      ...request.payload,
      threadId,
      ownerId: request.auth.credentials.id,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentHandler(request, h) {
    const { commentId } = request.params;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    await deleteCommentUseCase.execute({
      commentId,
      ownerId: request.auth.credentials.id,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
