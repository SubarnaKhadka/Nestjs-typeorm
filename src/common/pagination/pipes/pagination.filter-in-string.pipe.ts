import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import { PipeTransform, Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { HelperArrayService } from 'src/common/helper/services/helper.array.service';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';

export function PaginationFilterInStringPipe(
  field: string,
  raw: boolean,
): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class MixinPaginationFilterStringPipe implements PipeTransform {
    constructor(
      @Inject(REQUEST) protected readonly request: IRequestApp,
      private readonly paginationService: PaginationService,
      private readonly helperArrayService: HelperArrayService,
    ) {}

    async transform(
      value: string,
    ): Promise<Record<string, { $in: string[] } | string[]>> {
      let finalValue: string[] = [];

      if (value) {
        finalValue = this.helperArrayService.uniqueKey(
          value.split(',').map((val: string) => val),
        );
      }

      let res: Record<string, any>;
      if (finalValue.length > 0) {
        res = this.paginationService.filterIn<string>(field, finalValue);
      }

      this.request.__pagination = {
        ...this.request.__pagination,
        filters: this.request.__pagination?.filters
          ? {
              ...this.request.__pagination?.filters,
              [field]: value,
            }
          : { [field]: value },
      };

      return res;
    }
  }

  return mixin(MixinPaginationFilterStringPipe);
}
