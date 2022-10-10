import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger';
import { Category as CategoryModel } from 'prisma/prisma-client';
import { SwaggerController } from '../common/decorators';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { EditCategoryDto } from './dto/edit-category.dto';
import { CategoryEntity } from './entities';

@Controller('categories')
@SwaggerController('categories')
// @Roles(UserRole.ADMIN)
@ApiForbiddenResponse({
    description: 'Access denied',
})
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @ApiOperation({ summary: 'Add a new category' })
    @ApiCreatedResponse({
        description: 'Add a new category successfully',
        type: CategoryEntity,
    })
    @Post()
    createCategory(@Body() dto: CreateCategoryDto): Promise<CategoryModel> {
        return this.categoryService.createCategory(dto);
    }

    @ApiOperation({ summary: 'Get all categories' })
    @ApiOkResponse({
        description: 'get list of category successfully',
        type: CategoryEntity,
        isArray: true,
    })
    @Get()
    getAllCategories(): Promise<CategoryModel[]> {
        return this.categoryService.getAllCategories();
    }

    @ApiOperation({ summary: 'Get a category by id' })
    @ApiOkResponse({
        description: 'get category by id successfully',
        type: CategoryEntity,
    })
    @Get(':id')
    getCategoryById(@Param('id', ParseIntPipe) categoryId: number) {
        return this.categoryService.getCategoryById(categoryId);
    }

    @ApiOperation({ summary: 'Edit a category by id' })
    @ApiOkResponse({
        description: 'edit category by id successfully',
        type: CategoryEntity,
    })
    @ApiForbiddenResponse({
        description: 'Access denied',
    })
    @Patch(':id')
    editCategoryById(
        @Param('id', ParseIntPipe) categoryId: number,
        @Body() dto: EditCategoryDto,
    ): Promise<CategoryModel> {
        return this.categoryService.editCategoryById(categoryId, dto);
    }

    @ApiOperation({ summary: 'Delete a category by id' })
    @ApiNoContentResponse({
        description: 'delete category by id successfully',
    })
    @ApiForbiddenResponse({
        description: 'Access denied',
    })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteCategory(@Param('id', ParseIntPipe) categoryId: number): Promise<void> {
        return this.categoryService.deleteCategory(categoryId);
    }
}
