import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class Result {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    ca: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    margin: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    ebitda: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    loss: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    year: number; 
}
export class CompanyDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    sector: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    siren: number;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ type: [Result] })
    results:Array<Result>
}