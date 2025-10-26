/**
 * Get User Profile Use Case
 * Application layer - orchestrates user profile retrieval
 */
export class GetUserProfileUseCase {
  constructor(userService) {
    this.userService = userService
  }

  /**
   * Execute user profile retrieval
   */
  async execute(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required')
      }

      // Get user profile through user service
      const user = await this.userService.getUserById(userId)

      return {
        success: true,
        data: user,
        message: 'User profile retrieved successfully'
      }
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error.message}`)
    }
  }
}