
export class CompanyDto {
    name: string;

    sector: string;

    siren: number;

    results: {

        ca: number;

        margin: number;

        ebitda: number;

        loss: number;

        year: number; 
    }
}