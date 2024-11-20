import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import {
  Brackets,
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOptionsRelations,
  ILike,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ICreateOptions } from '../../interfaces/createOption.interface';
import { IDeleteRawOptions } from '../../interfaces/deleteOption.interface';
import {
  IFindAllOptions,
  IFindOneOptions,
  IPaginateFindOption,
  IPaginateQueryBuilderOption,
} from '../../interfaces/findOption.interface';
import {
  IUpdateOptions,
  IUpdateRawOptions,
} from '../../interfaces/updateOption.interface';
import { DatabaseBaseEntity } from '../entity/BaseEntity';

export interface Result {
  data: any[];
  _pagination: IPaginationMeta;
}

export abstract class BaseRepository<T extends DatabaseBaseEntity> {
  protected _entityRepo: Repository<T>;
  protected _relations?: FindOptionsRelations<T>;

  constructor(entityRepo: Repository<T>, relations?: FindOptionsRelations<T>) {
    this._entityRepo = entityRepo;
    this._relations = relations;
  }

  async _create(
    createDto: DeepPartial<T>,
    options?: ICreateOptions,
  ): Promise<T> {
    if (options?.entityManager) {
      const entity = options.entityManager.create(
        this._entityRepo.target,
        createDto,
      );
      return await options.entityManager.save(this._entityRepo.target, entity);
    }
    const entity = this._entityRepo.create(createDto);
    return await this._entityRepo.save(entity);
  }

  async _findAll(options?: IFindAllOptions<T>): Promise<T[]> {
    const find = options?.options ?? {};
    if (options?.transaction) {
      find.transaction = true;
    }
    if (options?.withDeleted) {
      find.withDeleted = true;
    }
    const relations = this.getRelations(options?.relations);
    if (relations) {
      find.relations = relations;
    }
    if (options?.entityManager) {
      return await options.entityManager.find(this._entityRepo.target, find);
    }
    return await this._entityRepo.find(options?.options);
  }

  async _findCount(options?: IFindAllOptions<T>): Promise<number> {
    const find = options?.options ?? {};
    if (options?.transaction) {
      find.transaction = true;
    }
    if (options?.withDeleted) {
      find.withDeleted = true;
    }
    const relations = this.getRelations(options?.relations);
    if (relations) {
      find.relations = relations;
    }
    if (options?.entityManager) {
      return await options.entityManager.count(this._entityRepo.target, find);
    }
    return await this._entityRepo.count(options?.options);
  }

  async _findOne(options: IFindOneOptions<T>): Promise<T | null> {
    const find = options?.options ?? {};
    if (options?.transaction) {
      find.transaction = true;
    }
    if (options?.withDeleted) {
      find.withDeleted = true;
    }
    const relations = this.getRelations(options?.relations);
    if (relations) {
      find.relations = relations;
    }
    if (options?.entityManager) {
      return await options.entityManager.findOne(this._entityRepo.target, find);
    }
    return await this._entityRepo.findOne(find);
  }

  async _findOneById(
    id: number,
    options?: IFindOneOptions<T>,
  ): Promise<T | null> {
    const find: any = options?.options ?? {};
    if (options?.transaction) {
      find.transaction = true;
    }
    if (options?.withDeleted) {
      find.withDeleted = true;
    }
    const relations = this.getRelations(options?.relations);
    if (relations) {
      find.relations = relations;
    }
    find.where = {};
    find.where['id'] = id;
    if (options?.entityManager) {
      return await options.entityManager.findOne(this._entityRepo.target, find);
    }
    return await this._entityRepo.findOne(find);
  }

  getRelations(
    option?: boolean | FindOptionsRelations<T>,
  ): FindOptionsRelations<T> | null {
    if (option) {
      if (typeof option === 'boolean') {
        return this._relations ?? null;
      } else {
        return option;
      }
    }
    return null;
  }

  getPaginationInfo(
    limit: number,
    page: number,
    totalItem: number,
  ): IPaginationMeta {
    const _pagination: IPaginationMeta = {
      total: totalItem,
      limit: limit,
      page: page,
      totalPage: 0,
    };
    _pagination.totalPage = Math.ceil(_pagination.total / limit);
    _pagination.nextPage =
      _pagination.page + 1 > _pagination.totalPage
        ? null
        : _pagination.page + 1;
    _pagination.prevPage =
      _pagination.page - 1 === 0 ? null : _pagination.page - 1;
    return _pagination;
  }

  getTakeSkip(limit: number, page: number): { take: number; skip: number } {
    return {
      take: limit,
      skip: (page - 1) * limit,
    };
  }

  async _paginateFind(options?: IPaginateFindOption<T>): Promise<{
    data: T[];
    _pagination: IPaginationMeta;
  }> {
    let find: FindManyOptions = {
      // order: {
      //   [options?.sortBy &&
      //   options?.sortableColumns &&
      //   options?.sortableColumns?.includes(options?.sortBy)
      //     ? options?.sortBy
      //     : 'createdAt']: options?.sortOrder || SORT_ORDER_ENUM.DESC,
      // },
      ...options?.options,
    };
    if (
      options?.sortBy &&
      options?.sortableColumns &&
      options?.sortableColumns?.includes(options?.sortBy)
    ) {
      find.order = {
        [options.sortBy]: options.sortOrder,
      };
    }
    if (
      (options?.searchBy ||
        (options?.defaultSearchColumns &&
          options?.defaultSearchColumns?.length &&
          options?.defaultSearchColumns?.length > 0)) &&
      options.search &&
      options?.searchableColumns &&
      Array.isArray(options?.searchableColumns) &&
      options.searchableColumns.length > 0
    ) {
      const columns: string[] = options?.searchBy
        ? options.searchBy.split(',')
        : options.defaultSearchColumns || [];

      const searchWhere = columns
        ?.filter((s) => options.searchableColumns?.includes(s))
        ?.map((s) => ({ [s]: ILike(`%${options.search}%`) }));

      if (find.where) {
        if (Array.isArray(find.where)) {
          console.log('Warning: Do not use array in where');
        } else {
          // oldWhere[Object.keys(s)[0]] = s[Object.keys(s)[0]];
          const oldWhere = { ...find.where };

          if (Array.isArray(searchWhere) && searchWhere.length > 0) {
            find.where = searchWhere.map((d) => [d, oldWhere]);
          }
        }
      } else {
        find.where = searchWhere;
      }
    }

    // pagination

    if (options?.canSkipPagination && options?.skipPagination) {
      const _pagination = {
        total: 0,
        limit: 0,
        page: 0,
        totalPage: 0,
        skipPagination: true,
      };
      let data: T[];
      if (options?.entityManager) {
        data = await options.entityManager.find(this._entityRepo.target, find);
      } else {
        data = await this._entityRepo.find(options?.options);
      }
      return { data, _pagination };
    } else {
      const limit = options?.limit ?? 20;
      const page = options?.page ?? 1;
      if (options?.transaction) {
        find.transaction = true;
      }
      if (options?.withDeleted) {
        find.withDeleted = true;
      }
      const relations = this.getRelations(options?.relations);
      if (relations) {
        find.relations = relations;
      }
      find = { ...find, ...this.getTakeSkip(limit, page) };

      let _pagination: IPaginationMeta = {
        total: 0,
        limit: 0,
        page: 0,
        totalPage: 0,
        nextPage: null,
        prevPage: null,
      };
      let data: T[];
      if (options?.entityManager) {
        const [result, count] = await options.entityManager.findAndCount(
          this._entityRepo.target,
          find,
        );
        data = result;
        _pagination.total = count;
      } else {
        const [result, count] = await this._entityRepo.findAndCount(find);
        data = result;
        _pagination.total = count;
      }

      _pagination = this.getPaginationInfo(limit, page, _pagination.total ?? 0);

      return { data, _pagination };
    }
  }
  async _paginatedQueryBuilder(
    options: IPaginateQueryBuilderOption,
  ): Promise<Result> {
    const {
      page = 1,
      limit = 20,
      sortBy,
      sortOrder = 'DESC',
      search,
      searchBy,
      queryBuilder,
      builderName,
      searchableColumns,
      sortableColumns,
      defaultSearchColumns = [],
      skipPagination = false,
      canSkipPagination = false,
    } = options;
    // Apply sorting
    if (
      sortBy &&
      sortableColumns &&
      sortableColumns?.length > 0 &&
      sortableColumns.includes(sortBy)
    ) {
      const columnName = `${builderName}.${sortBy}`;
      queryBuilder.orderBy(columnName, sortOrder);
    }

    // Apply searching
    if (
      search &&
      (searchBy || defaultSearchColumns.length > 0) &&
      searchableColumns
    ) {
      const columns: string[] = options?.searchBy
        ? options.searchBy.split(',')
        : options.defaultSearchColumns || [];

      const filteredSearchName = columns
        ?.filter((s) => options.searchableColumns?.includes(s))
        ?.map((s) => builderName + '.' + s);

      if (filteredSearchName?.length > 0) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            for (const key of filteredSearchName) {
              qb.orWhere(`${key} ILIKE :search`, {
                search: `%${search}%`,
              });
            }
          }),
        );
      }
    }

    if (canSkipPagination && skipPagination) {
      const _pagination = {
        total: 0,
        limit: 0,
        page: 0,
        totalPage: 0,
        skipPagination: true,
      };
      const data: T[] = await queryBuilder.getMany();

      return { data, _pagination };
    } else {
      // Calculate pagination values
      const currentPage = Number(page) || 1;

      // Apply pagination
      const offset = (currentPage - 1) * limit;
      queryBuilder.skip(offset).take(limit);

      // Fetch data
      const [items, totalItems] = await queryBuilder.getManyAndCount();

      // Build result object
      const result: Result = {
        data: items,
        _pagination: this.getPaginationInfo(limit, page, totalItems),
      };

      return result;
    }
  }

  async _updateRaw(
    updateDto: QueryDeepPartialEntity<T>,
    options: IUpdateRawOptions<T>,
  ): Promise<UpdateResult> {
    if (options?.entityManager) {
      return await options.entityManager.update(
        this._entityRepo.target,
        options.where,
        updateDto,
      );
    }
    return await this._entityRepo.update(options.where, updateDto);
  }
  async _update(repo: T, options?: IUpdateOptions<T>): Promise<T> {
    if (options?.entityManager) {
      return await options.entityManager.save(this._entityRepo.target, repo);
    }
    return await this._entityRepo.save(repo);
  }

  async _softDelete(repo: T, options?: IUpdateOptions<T>): Promise<T> {
    repo.deletedAt = new Date();
    if (options?.entityManager) {
      return await options.entityManager.save(this._entityRepo.target, repo);
    }
    return await this._entityRepo.save(repo);
  }

  async _delete(repo: T, options?: IUpdateOptions<T>): Promise<T> {
    const returnRepo = { ...repo };
    if (options?.entityManager) {
      return await options.entityManager.remove(this._entityRepo.target, repo);
    }
    await this._entityRepo.remove(repo);
    return returnRepo;
  }

  async _deleteRaw(options: IDeleteRawOptions<T>): Promise<DeleteResult> {
    if (options?.entityManager) {
      return await options.entityManager.delete(
        this._entityRepo.target,
        options.where,
      );
    }
    return await this._entityRepo.delete(options.where);
  }

  async _softDeleteRaw(options: IUpdateRawOptions<T>): Promise<UpdateResult> {
    if (options?.entityManager) {
      return await options.entityManager.softDelete(
        this._entityRepo.target,
        options.where,
      );
    }
    return await this._entityRepo.softDelete(options.where);
  }

  async _restoreRaw(options: IUpdateRawOptions<T>): Promise<UpdateResult> {
    if (options?.entityManager) {
      return await options.entityManager.restore(
        this._entityRepo.target,
        options.where,
      );
    }
    return await this._entityRepo.restore(options.where);
  }
}
