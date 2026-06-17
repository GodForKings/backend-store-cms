import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorization, CurrentUser } from 'src/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @Get('profile')
  async getProfile(@CurrentUser('id') id: string) {
    return await this.userService.getById(id);
  }

  @Authorization()
  @Patch('profile/favorites/:productId')
  async toggleFavorite(@CurrentUser('id') userId: string, @Param('productId') productId: string) {
    return await this.userService.toggleFavorite(productId, userId);
  }
}
