export interface Pagination {
    skip?: number;
    take?: number;
    cursor?: number;
    sort?: { field: string; by: 'asc' | 'desc' }[];
    search?: { field: string; value: string }[];
}
