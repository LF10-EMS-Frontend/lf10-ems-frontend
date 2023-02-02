export class Employee {
  constructor(
      public skillSet: string[],
      public id?: number,
      public lastName?: string,
      public firstName?: string,
      public street?: string,
      public postcode?: string,
      public city?: string,
      public phone?: string,
  ) {}
}
