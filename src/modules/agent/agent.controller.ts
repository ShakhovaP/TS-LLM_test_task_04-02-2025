import { Controller, Post, Body } from '@nestjs/common';
import { AgentService } from './agent.service';

class QueryDto {
    query: string;
}

@Controller('agent')
export class AgentController {
    constructor(private readonly agentService: AgentService) {}
  
    @Post()
    async processQuery(@Body() queryDto: QueryDto) {
        return this.agentService.processQuery(queryDto.query);
    }
}
