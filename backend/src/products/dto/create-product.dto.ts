import { IsString, IsNumber, IsNotEmpty, IsUrl, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsUrl()
    image: string;

    @IsOptional()
    rating?: {
        rate: number;
        count: number;
    };

    @IsNumber()
    @Min(0)
    @IsOptional()
    stock?: number;
}