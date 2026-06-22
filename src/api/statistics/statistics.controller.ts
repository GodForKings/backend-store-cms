import { Controller, Get, Param } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Authorization } from 'src/common';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Authorization()
  @Get('main/:storeId')
  async getMainStatistics(@Param('storeId') storeId: string) {
    return await this.statisticsService.getMainStatistics(storeId);
  }

  @Authorization()
  @Get('middle/:storeId')
  async getMiddleStat(@Param('storeId') storeId: string) {
    return await this.statisticsService.getMiddleStatistic(storeId);
  }
}
