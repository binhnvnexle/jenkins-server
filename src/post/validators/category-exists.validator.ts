import { Injectable } from '@nestjs/common';
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { CategoryService } from '../../category/category.service';

@ValidatorConstraint({ name: 'CategoryExists', async: true })
@Injectable()
export class CategoryExistsRule implements ValidatorConstraintInterface {
    constructor(private categoryService: CategoryService) {}

    async validate(value: number) {
        try {
            const category = await this.categoryService.findOne({ id: value });
            if (!category) {
                return false;
            }
        } catch (e) {
            return false;
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `The Category does not exist`;
    }
}
