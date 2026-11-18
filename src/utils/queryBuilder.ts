import { Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(
    modelQuery: Query<T[], T>,
    query: Record<string, unknown>
  ) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm;

    if (typeof searchTerm === "string" && searchTerm.trim()) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    ["searchTerm", "sort", "limit", "page", "fields"].forEach(
      (field) => delete queryObj[field]
    );

    this.modelQuery = this.modelQuery.find(queryObj);

    return this;
  }

  sort() {
    const sort =
      typeof this.query.sort === "string"
        ? this.query.sort.split(",").join(" ")
        : "-createdAt";

    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  paginate() {
    const page = Math.max(1, Number(this.query.page) || 1);
    const limit = Math.max(1, Number(this.query.limit) || 10);
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      typeof this.query.fields === "string"
        ? this.query.fields.split(",").join(" ")
        : "-__v";

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  async countTotal() {
    const total = await this.modelQuery.model.countDocuments(
      this.modelQuery.getFilter()
    );

    const page = Math.max(1, Number(this.query.page) || 1);
    const limit = Math.max(1, Number(this.query.limit) || 10);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default QueryBuilder;