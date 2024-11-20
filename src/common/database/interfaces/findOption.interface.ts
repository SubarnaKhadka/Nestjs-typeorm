import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  SelectQueryBuilder,
} from 'typeorm';

export enum SORT_ORDER_ENUM {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IPaginationSetting {
  sortableColumns?: string[];
  searchableColumns?: string[];
  defaultSearchColumns?: string[];
  canSkipPagination?: boolean;
}

export interface IFindAllOptions<T> extends IPaginationSetting {
  entityManager?: EntityManager;
  options?: FindManyOptions<T>;
  relations?: FindOptionsRelations<T> | boolean;
  transaction?: boolean;
  withDeleted?: boolean;
  sortOrder?: SORT_ORDER_ENUM;
  sortBy?: string;
  search?: string;
  searchBy?: string;
}
export interface IFindOneOptions<T> {
  entityManager?: EntityManager;
  options?: FindOneOptions<T>;
  relations?: FindOptionsRelations<T> | boolean;
  transaction?: boolean;
  withDeleted?: boolean;
  failIfNotFound?: boolean;
}
export interface IPaginateFindOption<T> extends IFindAllOptions<T> {
  skipPagination?: boolean;
  page?: number;
  limit?: number;
}

export interface IPaginateQueryBuilderOption extends IPaginationSetting {
  skipPagination?: boolean;
  queryBuilder: SelectQueryBuilder<any>;
  builderName: string;
  withDeleted?: boolean;
  sortOrder?: SORT_ORDER_ENUM;
  sortBy?: string;
  search?: string;
  searchBy?: string;
  page?: number;
  limit?: number;
}
