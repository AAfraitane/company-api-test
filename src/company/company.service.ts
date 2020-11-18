import { Injectable } from '@nestjs/common';

@Injectable()
export class CompanyService {
    public getAll() {
        return "My companies"
    }
}
