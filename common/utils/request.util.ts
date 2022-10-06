import { logger } from '../../app.module';
import { PaginationQueryDto } from '../dto';
import { Pagination } from '../types';

export function getPaginationParams(params: PaginationQueryDto): Pagination {
    const paginationParams: Pagination = {
        skip: 0,
        take: 10,
        sort: [],
        search: [],
        cursor: 0,
    };

    paginationParams.skip = params.skip ? parseInt(params.skip.toString()) : 0;
    paginationParams.take = params.limit ? parseInt(params.limit.toString()) : 10;
    if (params.startId) {
        paginationParams.skip = 1;
        paginationParams.cursor = params.startId ? parseInt(params.startId.toString()) : 0;
    }

    // create array of sort
    if (params.sort) {
        const sortArray = params.sort.toString().split(',');
        paginationParams.sort = sortArray.map((sortItem) => {
            const sortBy = sortItem[0];
            switch (sortBy) {
                case '-':
                    return {
                        field: sortItem.slice(1),
                        by: 'asc',
                    };
                case '+':
                    return {
                        field: sortItem.slice(1),
                        by: 'desc',
                    };
                default:
                    return {
                        field: sortItem.trim(),
                        by: 'desc',
                    };
            }
        });
    }
    if (paginationParams.sort.length === 0) {
        paginationParams.sort = [{ field: 'id', by: 'asc' }];
    }

    // create array of search
    // if (params.search) {
    //     const searchArray = params.search.toString().split(',');
    //     paginationParams.search = searchArray.map((searchItem) => {
    //         const field = searchItem.split(':')[0];
    //         const value = searchItem.split(':')[1];
    //         return {
    //             field,
    //             value,
    //         };
    //     });
    // }

    logger.debug(`paginationParams ${JSON.stringify(paginationParams)}`);
    return paginationParams;
}
