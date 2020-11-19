import { BadGatewayException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CompanyDto } from './model/company';

export enum sort {
    sector = 'sector',
    name = 'name',
}
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
        @Query('sortBy') sortBy: sort,
    ): Array<CompanyDto> {
        if (name || sector) {
            return this.companyService.getCompanyByNameOrSector(name, sector, sortBy);
        }
        return this.companyService.getAll(sortBy);
    }

    @ApiResponse({
        status: 200,
        description: 'The found company',
        type: CompanyDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Validation failed (numeric string is expected)',
    })
    @Get(':siren')
    getCompanyBySiren(@Param('siren', ParseIntPipe) siren: number): CompanyDto {
        return this.companyService.getCompanyBySiren(siren);
    }

    @Put(':siren')
    putCompany(
        @Param('siren', ParseIntPipe) siren: number,
        @Body() company: CompanyDto): void {
        if (siren !== company.siren) {
            throw new BadGatewayException("Location must math siren");
        }
        return this.companyService.createCompany(company);
    }

    @Post()
    postCompanies(@Body() companies: Array<CompanyDto>): void {
        return this.companyService.createCompanies(companies);
    }

    @Delete(':siren')
    deleteCompany(
        @Param('siren', ParseIntPipe) siren: number): void {
        return this.companyService.deleteCompanyBySiren(siren);
    }
}
