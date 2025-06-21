import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('status')
@Controller()
@Public()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API status or health check' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current API status as a string.',
  })
  getStatus(): string {
    return this.appService.getStatus();
  }
}
