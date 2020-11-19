
export class CompanyDto {
    name: string;

    sector: string;

    siren: number;

    results: Array<Result>
}

class Result {
    ca: number;

    margin: number;

    ebitda: number;

    loss: number;

    year: number; 
}