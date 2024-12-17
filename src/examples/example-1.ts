import { DataManager } from '../grid/data-manager';
import { Grid } from '../grid/grid';
import { GridOptions } from '../grid/options';
import { faker } from '@faker-js/faker';

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

const data: DataSource[] = new Array(10_000).fill(0).map(
  (_, i) =>
    new DataSource({
      id: i,
      age: faker.number.int({ min: 18, max: 70 }),
      name: faker.person.fullName(),
    })
);

export function renderExample1(root: HTMLElement | null | undefined) {
  if (!root) {
    throw new Error('Root element not found');
  }

  const dm = new DataManager<DataSource>();

  dm.data = data;

  const grid = new Grid(options, dm);

  grid.attachTo(root);
}
