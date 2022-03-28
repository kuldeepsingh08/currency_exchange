export class Symbol {
  success!: boolean;
  symbols!: object
}

export class Latest {
  base!: string;
  date!: string;
  rates!: object;
  success!: boolean;
  timestamp!: number;
}

export class PastData {
  rates!: object
  success!: boolean
}
