const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
const NewThread = require('../../../Domains/threads/entities/NewThread');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'body',
      ownerId: 'ownerId',
    };
    const expectedThread = {
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.ownerId,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    /** creating use case instance */
    const getAddThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getAddThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      ownerId: useCasePayload.ownerId,
    }));
  });
});
