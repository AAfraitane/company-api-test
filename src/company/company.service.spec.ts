import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyService],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should getAll companies', () => {
    const allCompanies = service.getAll();
    const expectedCompanies = require('../../resources/companies.json');

    expect(allCompanies).toBe(expectedCompanies);
  });

  it('should get company by siren', () => {
    const company = service.getCompanyBySiren(107855014);
    const expectedCompany = {
      "name": "Torphy, Rosenbaum and Rempel",
      "sector": "Electronic",
      "siren": 107855014,
      "results": [
          {
              "ca": 364921,
              "margin": 61976,
              "ebitda": 960673,
              "loss": 2812728,
              "year": 2017
          },
          {
              "ca": 1944186,
              "margin": 738525,
              "ebitda": 846608,
              "loss": 657145,
              "year": 2016
          }
      ]
    };
    expect(JSON.stringify(company)).toBe(JSON.stringify(expectedCompany));
  });

  it('should get companies by name', () => {
    const companies = service.getCompanyByNameOrSector("Collins Group", null);
    expect(companies.length).toBe(2);
    companies.forEach((company) => {
      expect(company.name).toBe("Collins Group");
    })
  });

  it('should get companies by sector', () => {
    const companies = service.getCompanyByNameOrSector(null, "Electronic");
    expect(companies.length).toBe(202);
    companies.forEach((company) => {
      expect(company.sector).toBe("Electronic");
    })
  });

  it('should get companies by sector and name', () => {
    const companies = service.getCompanyByNameOrSector("Collins Group", "Electronic");
    expect(companies.length).toBe(1);
    companies.forEach((company) => {
      expect(company.sector).toBe("Electronic");
      expect(company.name).toBe("Collins Group");
    })
  });
});
