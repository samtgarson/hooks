// Type definitions for airtable 0.5
// Project: https://github.com/airtable/airtable.js
// Definitions by: Brandon Valosek <https://github.com/bvalosek>
//                 Max Chehab <https://github.com/maxchehab>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.2

declare module 'airtable' {
  type baseCreateFunctor = (tableName: string) => Table<{}>

  export default class Airtable {
    constructor(options?: AirtableOptions);
    base(appId: string): baseCreateFunctor;
  }

  export class Base {
    constructor(airtable: Airtable, baseId: string);
    table(tableName: string): Table<{}>;
    getId(): string;
  }

  export class Table<TFields extends FieldSet> {
    constructor (base: Base, tableId: string, tableName: string);
    select(opt?: SelectOptions): Query<TFields>;
    find(id: string): Promise<Response<TFields>>;
    create(record: TFields, opts?: { typecast: boolean }): Promise<Response<TFields>>;
    create(records: TFields[], opts?: { typecast: boolean }): Promise<Array<Response<TFields>>>;
    update(...args: any[]): Promise<any>;
    replace(...args: any[]): Promise<any>;
    destroy(...args: any[]): Promise<any>;
  }

  type Value = undefined
    | string
    | number
    | boolean
    | Collaborator
    | ReadonlyArray<Collaborator>
    | ReadonlyArray<string>
    | ReadonlyArray<Attachment>;

  export interface FieldSet {
    [key: string]: Value;
  }

  export interface AirtableOptions {
    apiKey?: string;
    endpointUrl?: string;
    apiVersion?: string;
    allowUnauthorizedSsl?: boolean;
    noRetryIfRateLimited?: boolean;
    requestTimeout?: number;
  }

  export interface SortParameter {
    field: string;
    direction?: 'asc' | 'desc';
  }

  export interface SelectOptions {
    fields?: string[];
    filterByFormula?: string;
    maxRecords?: number;
    pageSize?: number;
    sort?: SortParameter[];
    view?: string;
    cellFormat?: 'json' | 'string';
    timeZone?: string;
    userLocale?: string;
  }

  export interface Query<TFields extends object> {
    all(): Promise<Response<TFields>>;
    firstPage(): Promise<Response<TFields>>;
    eachPage(pageCallback: (records: Response<TFields>, next: () => void) => void): Promise<void>;
  }

  export type Response<TFields> = ReadonlyArray<Record<TFields extends FieldSet>>;

  export class Record<TFields extends FieldSet> {
    constructor(table: Table<TFields>, recordId: string, recordJson: TFields);
    id: string;
    fields: TFields;
    get(columnName: string): Value;
    set(columnName: string, columnValue: Value): void;
    save(): Promise<this>;
    patchUpdate(cellValuesByName: FieldSet): Promise<this>;
    putUpdate(cellValuesByName: FieldSet): Promise<this>;
  }

  export interface Attachment {
    id: string;
    url: string;
    filename: string;
    size: number;
    type: string;
    thumbnails?: {
      small: Thumbnail;
      large: Thumbnail;
      full: Thumbnail;
    };
  }

  export interface Thumbnail {
    url: string;
    width: number;
    height: number;
  }

  export interface Collaborator {
    id: string;
    email: string;
    name: string;
  }
}
