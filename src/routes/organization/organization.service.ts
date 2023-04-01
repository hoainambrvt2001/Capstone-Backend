import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from '../../schemas/organization.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private orgModel: Model<OrganizationDocument>,
  ) {}

  async search(
    queryString: string,
    page: string,
    limit: string,
  ) {
    try {
      const reg = new RegExp(queryString, 'i');
      const filters = { name: reg };

      //** Determine options in find() */
      const options: any = {
        limit: limit ? parseInt(limit) : 9,
        skip: page ? parseInt(page) - 1 : 0,
      };

      //** Find organizations */
      const orgs = await this.orgModel
        .find(filters, null, options)
        .select('_id name');

      //** Calculate total number of organizations */
      const totalOrgs = await this.orgModel.count(filters);
      const last_page = Math.ceil(
        totalOrgs / options.limit,
      );

      return {
        status: 200,
        data: orgs,
        total: totalOrgs,
        page: options.skip + 1,
        last_page: last_page ? last_page : 1,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
