import { BadRequestException, Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
    @ApiResponse({
        status: 404,
        description: 'No company match your request',
    })
    @ApiQuery({ name: 'name', required: false })
    @ApiQuery({ name: 'sector', required: false, example: "Energy" })
    @ApiQuery({ name: 'sortBy', required: false })
    @ApiQuery({ name: 'page', required: false, example: 2 })
    @ApiQuery({ name: 'size', required: false, example: 10 })
    getCompanies(
        @Query('name') name: string,
        @Query('sector') sector: string,
        @Query('sortBy') sortBy: sort,
        @Query('page') pageNumber: number,
        @Query('size') pageSize: number,
    ): Array<CompanyDto> {
        if (name || sector) {
            return this.companyService.getCompanyByNameOrSector(name, sector, sortBy, pageSize, pageNumber);
        }
        return this.companyService.getAll(sortBy, pageSize, pageNumber);
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
    @ApiResponse({
        status: 404,
        description: 'No company found with siren XXXXXX',
    })
    @Get(':siren')
    getCompanyBySiren(@Param('siren', ParseIntPipe) siren: number): CompanyDto {
        return this.companyService.getCompanyBySiren(siren);
    }

    @Put(':siren')
    @ApiResponse({
        status: 201,
    })
    @ApiResponse({
        status: 400,
        description: 'Location must match siren',
    })
    @ApiResponse({
        status: 400,
        description: 'Validation failed (numeric string is expected)',
    })
    putCompany(
        @Param('siren', ParseIntPipe) siren: number,
        @Body() company: CompanyDto): void {
        if (siren !== company.siren) {
            throw new BadRequestException("Location must match siren");
        }
        return this.companyService.createOrUpdateCompany(company);
    }

    @Post()
    @ApiResponse({
        status: 201,
    })
    @ApiResponse({
        status: 400,
        description: 'Company with siren XXXX already exist',
    })
    @ApiBody({
        type: [CompanyDto]
    })
    postCompanies(@Body(new ParseArrayPipe({ items: CompanyDto })) companies: Array<CompanyDto>): void {
        return this.companyService.createCompanies(companies);
    }

    @ApiResponse({
        status: 200,
    })
    @ApiResponse({
        status: 400,
        description: 'Validation failed (numeric string is expected)',
    })
    @ApiResponse({
        status: 400,
        description: 'Company with siren 12 doesn\'t exist',
    })
    @Delete(':siren')
    deleteCompany(
        @Param('siren', ParseIntPipe) siren: number): void {
        return this.companyService.deleteCompanyBySiren(siren);
    }
}
