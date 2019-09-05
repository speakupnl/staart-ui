import { Paginated } from "./root";
import { User } from "./users";
import { Group } from "./manage";

export interface ElasticSearchRecord {
  _index: string;
  _type: string;
  _id: string;
  _score: number | null;
  _source: {
    [index: string]: any;
  };
  sort?: number[];
}

export interface Users extends Paginated {
  data: User[];
}
export interface Groups extends Paginated {
  data: Group[];
}
export interface ServerLogs extends Paginated {
  data: ElasticSearchRecord[];
}

export interface RootState {
  users: Users,
  groups: Groups,
  serverLogs: ServerLogs
}

export const emptyPagination = {
  data: [],
  hasMore: false
};
