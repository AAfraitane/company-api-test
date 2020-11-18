import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CompanyDto } from './model/company';

@ApiTags('company')
@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get()
    @ApiResponse({
        status: 200,
        description: 'The found companies',
        type: [CompanyDto],
    })
    getCompanies(
        @Query('name') name: string,
        @Query('sector') sector: string,
    ): Array<CompanyDto> {
        if (name || sector) {
            return this.companyService.getCompanyByNameOrSector(name, sector);
        }
        return this.companyService.getAll();
    }

    @Get(':siren')
    getCompanyBySiren(@Param('siren', ParseIntPipe) siren: number): CompanyDto {
        return this.companyService.getCompanyBySiren(siren);
    }
}
