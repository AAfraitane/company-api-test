import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { sort } from './company.controller';
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
    const allCompanies = service.getAll(null, null, null);
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
    const companies = service.getCompanyByNameOrSector("Collins Group", null, null, null, null);
    expect(companies.length).toBe(2);
    companies.forEach((company) => {
      expect(company.name).toBe("Collins Group");
    })
  });

  it('should get companies by sector', () => {
    const companies = service.getCompanyByNameOrSector(null, "Electronic", null, null, null);
    expect(companies.length).toBe(202);
    companies.forEach((company) => {
      expect(company.sector).toBe("Electronic");
    })
  });

  it('should get companies by sector and name', () => {
    const companies = service.getCompanyByNameOrSector("Collins Group", "Electronic", null, null, null);
    expect(companies.length).toBe(1);
    companies.forEach((company) => {
      expect(company.sector).toBe("Electronic");
      expect(company.name).toBe("Collins Group");
    })
  });

  it('should test sort companies', () => {
    const nonSortedCompanies = [
      {
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
      },
      {
        "name": "Morphy, Rosenbaum and Rempel",
        "sector": "Electronic",
        "siren": 107855016,
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
      }
    ];
    const sortedCompanies = [
      {
        "name": "Morphy, Rosenbaum and Rempel",
        "sector": "Electronic",
        "siren": 107855016,
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
      },
      {
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
      }
    ];
    expect(
      JSON.stringify(service.sortCompanies(nonSortedCompanies, sort.name))
    ).toBe(
      JSON.stringify(sortedCompanies)
    )
  });

  it('should delete company by siren', () => {
    service.deleteCompanyBySiren(107855014);
    try {
      service.getCompanyBySiren(107855014);
    } catch (error) {
      expect(
        JSON.stringify(error)
      ).toBe(
        JSON.stringify(new NotFoundException(`No company found with siren 107855014`))
      );
    }
  });

  it('should create company or update if exist', () => {
    const company = {
      "name": "Torphy, Rosenbaum and Rempel New",
      "sector": "Electronic",
      "siren": 10785501400,
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
    }
    service.createOrUpdateCompany(company);
    const createdCompany = service.getCompanyBySiren(company.siren);
    expect(
      JSON.stringify(company)
    ).toBe(
      JSON.stringify(createdCompany)
    )
  });

  it('should bulk create companies', () => {
    const companies = [{
      "name": "Torphy, Rosenbaum and Rempel New",
      "sector": "Electronic",
      "siren": 10785501401,
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
    }]
    service.createCompanies(companies);
    const createdCompany = service.getCompanyBySiren(companies[0].siren);
    // Test bulk creation
    expect(
      JSON.stringify(companies[0])
    ).toBe(
      JSON.stringify(createdCompany)
    )
    // Should throw an error if company already exist 
    try {
      service.createCompanies(companies);
    } catch (error) {
      expect(
        JSON.stringify(error)
      ).toBe(
        JSON.stringify(new BadRequestException(`Company with siren ${companies[0].siren} already exist`))
      );
    }
  });

  it('should paginate companies', () => {
    const allCompanies = service.getAll(null, null, null);
    const expectedPaginateComp = [{"name":"Hane-Stanton","sector":"Luxury","siren":151419067,"results":[{"ca":1911503,"margin":340643,"ebitda":417233,"loss":5121889,"year":2017},{"ca":3669705,"margin":937608,"ebitda":162576,"loss":8516803,"year":2016}]},{"name":"Gaylord and Sons","sector":"Retail","siren":147007807,"results":[{"ca":2802947,"margin":-192527,"ebitda":895332,"loss":168490,"year":2017},{"ca":1704685,"margin":675635,"ebitda":175060,"loss":8978142,"year":2016}]}];
    expect(
      JSON.stringify(service.paginate(allCompanies, 2, 2))
    ).toBe(
      JSON.stringify(expectedPaginateComp)
    );
  });
});
