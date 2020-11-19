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

    public createCompany(company: CompanyDto): void {
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

    public getAll(sortBy: sort): Array<CompanyDto> {
        if (sortBy) {
            return this.sortCompanies(this.allCompanies, sortBy);
        }
        return this.allCompanies;
    }

    public sortCompanies(companies: Array<CompanyDto>, sortBy: sort): Array<CompanyDto> {
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
    public getCompanyByNameOrSector(name: string, sector: string, sortBy: sort): Array<CompanyDto> {
        let companies = this.allCompanies;
        // Filtering
        if (name) {
            companies = companies.filter((company) => company.name === name);
        }
        if (sector) {
            companies = companies.filter((company) => company.sector === sector);
        }
        if(companies.length === 0) {
            throw new NotFoundException(`No company match your request`);
        }
        // Sorting
        if (sortBy) {
            return this.sortCompanies(companies, sortBy);
        }
        return companies;
    }
}
