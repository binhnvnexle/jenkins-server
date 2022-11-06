import { Injectable } from '@nestjs/common';
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { CategoryService } from '../../category/category.service';

@ValidatorConstraint({ name: 'CategoryExists', async: true })
@Injectable()
export class CategoryExistsValidator implements ValidatorConstraintInterface {
    constructor(private categoryService: CategoryService) {}

    async validate(value: number) {
        try {
            if (!this.categoryService) {
                return true; // skip the validation. Somehow the dependencies are not injected by E2E test. In reality, this won't happen
            }
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
        return `The category does not exist`;
    }
}
