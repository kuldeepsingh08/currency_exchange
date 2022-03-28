export interface LATEST {
  base: string;
  date: string;
  rates: object;
  success: boolean;
  timestamp: number;
}

export interface SYMBOLS {
  success: boolean;
  symbols: object;
}

export interface HISTORYDATA {
  from: string | number;
  to: string | number;
  value: string | number;
  queryValue: string | number;
}
