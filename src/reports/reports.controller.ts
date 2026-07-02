import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales-by-user')
  salesByUser(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('sortBy') sortBy: string,
  ) {
    const end = endDate ?? new Date().toISOString();
    const start = startDate ?? '2000-01-01T00:00:00.000Z';
    return this.reportsService.salesByUser(start, end, sortBy);
  }

  @Get('last')
  getLastReport() {
    return this.reportsService.getLastReport();
  }
}
