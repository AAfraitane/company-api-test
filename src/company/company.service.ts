import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CompanyDto } from './model/company';

const allCompaniesMock = require('../../resources/companies.json');

@Injectable()
export class CompanyService {
    private allCompanies: Array<CompanyDto>;

    constructor() {
        this.allCompanies = allCompaniesMock;
    }

    public getAll(): Array<CompanyDto> {
        return this.allCompanies;
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
    public getCompanyByNameOrSector(name: string, sector: string): Array<CompanyDto> {
        let companies = this.allCompanies;
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
}
