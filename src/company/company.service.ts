import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { sort } from './company.controller';
import { CompanyDto } from './model/company';

const allCompaniesMock = require('../../resources/companies.json');

@Injectable()
export class CompanyService {
    private allCompanies: Array<CompanyDto>;

    constructor() {
        this.allCompanies = allCompaniesMock;
    }

    public deleteCompanyBySiren(siren: number): void {
        const indexToDelete = this.allCompanies.findIndex((comp) => comp.siren === siren);
        if (indexToDelete > -1) {
            this.allCompanies.splice(indexToDelete, 1);
        } else {
            throw new BadRequestException(`Company with siren ${siren} doesn't exist`);
        }
    }

    public createOrUpdateCompany(company: CompanyDto): void {
        const newCoIndex = this.allCompanies.findIndex((comp) => comp.siren === company.siren);
        if (newCoIndex > -1) {
            this.allCompanies[newCoIndex] = company;
        } else {
            this.allCompanies.push(company);
        }
    }

    public createCompanies(companies: CompanyDto[]): void {
        this.checkIfCompanyAlreadyExists(companies);
        this.allCompanies.push(...companies);
    }

    public checkIfCompanyAlreadyExists(companies: CompanyDto[]) {
        companies.forEach((newCompany) => {
            const newCoIndex = this.allCompanies.findIndex((comp) => comp.siren === newCompany.siren);
            if (newCoIndex > -1) {
                throw new BadRequestException(`Company with siren ${newCompany.siren} already exist`);
            }
        });
    }

    public getAll(sortBy: sort, pageSize: number, pageNumber: number): Array<CompanyDto> {
        let companies = this.allCompanies;
        companies = this.sortCompaniesIfRequired(companies, sortBy);
        companies = this.paginateCompaniesIfRequired(companies, pageSize, pageNumber);
        return companies;
    }

    public sortCompaniesIfRequired(companies: Array<CompanyDto>, sortBy: sort): Array<CompanyDto> {
        if (!sortBy) {
            return companies;
        }
        companies.sort((compA, compB) => {
            const sortingPropA = compA[sortBy].toLowerCase(),
                sortingPropB = compB[sortBy].toLowerCase();
        
            if (sortingPropA < sortingPropB) {
                return -1;
            }
            if (sortingPropA > sortingPropB) {
                return 1;
            }
            return 0;
        });
        return companies;
    }

    /**
     * Get unique company by siren
     * @param siren 
     */
    public getCompanyBySiren(siren: number): CompanyDto {
        const companyBySiren = this.allCompanies.filter((company) => company.siren === siren);
        if (companyBySiren.length > 1) {
            throw new InternalServerErrorException(`Found multiple occurences with siren ${siren}`);
        } else if(companyBySiren.length === 0) {
            throw new NotFoundException(`No company found with siren ${siren}`);
        }
        return companyBySiren[0];
    }

    /**
     * Get companies by name (in most of the cases the name is unique but we can find exception
     * that is why siren is prefered for unicity)
     * @param name 
     */
    public getCompanyByNameOrSector(name: string, sector: string, sortBy: sort, pageSize: number, pageNumber: number): Array<CompanyDto> {
        let companies = this.allCompanies;
        companies = this.filterCompaniesByNameOrSectorIfRequired(companies, name, sector);       
        companies = this.sortCompaniesIfRequired(companies, sortBy);
        companies = this.paginateCompaniesIfRequired(companies, pageSize, pageNumber);
        return companies;
    }

    public filterCompaniesByNameOrSectorIfRequired(companies: Array<CompanyDto>, name: string, sector: string): Array<CompanyDto> {
        if (name) {
            companies = companies.filter((company) => company.name === name);
        }
        if (sector) {
            companies = companies.filter((company) => company.sector === sector);
        }
        if(companies.length === 0) {
            throw new NotFoundException(`No company match your request`);
        }
        return companies;
    }

    /** This function paginate 
     * All the param must be not null in oder to process pagination
     * @param companies 
     * @param pageSize Limit the page size. if this param is greater than array.length ingore pagination
     * @param pageNumber 
     */
    public paginateCompaniesIfRequired(companies: Array<CompanyDto>, pageSize: number, pageNumber: number) {
        if (companies.length> 0 && pageSize && pageNumber) {
            return companies.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
        }
        return companies;
    }
}
