import { DataManager } from '../grid/data-manager';
import { Grid } from '../grid/grid';
import { GridOptions } from '../grid/options';

class DataSource {
  constructor(copy?: Partial<DataSource>) {
    this.id = copy?.id ?? 0;
    this.age = copy?.age ?? 0;
    this.name = copy?.name ?? '';
  }

  public id: number;

  public age: number;

  public name: string;
}

const options: GridOptions<DataSource> = {
  columns: [
    {
      field: 'name',
      name: 'Name',
    },
    {
      field: 'age',
      name: 'Age',
    },
  ],
};

const data: DataSource[] = [
  new DataSource({
    id: 0,
    age: 30,
    name: 'John Doe',
  }),
  new DataSource({
    id: 1,
    age: 25,
    name: 'Jane Doe',
  }),
  new DataSource({
    id: 2,
    age: 35,
    name: 'John Smith',
  }),
];

export function renderExample1(root: HTMLElement | null | undefined) {
  if (!root) {
    throw new Error('Root element not found');
  }

  const dm = new DataManager<DataSource>();

  dm.data = data;

  const grid = new Grid(options, dm);

  grid.attachTo(root);
}
