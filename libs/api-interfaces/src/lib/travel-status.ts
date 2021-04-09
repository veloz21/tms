export interface ITravelStatus {
  id?: any;
  date: Date;
  name: string;
  comments: string;
  relatedStatus?: {
    box?: any,
    truck?: any,
    employee?: any,
  };
}
