import './example-2.scss';

import { Grid } from '../grid/grid';
import { GridOptions } from '../grid/options';
import { faker } from '@faker-js/faker';
import { div } from '../grid/util';

class DataSource {
  constructor(copy?: Partial<DataSource>) {
    this.id = copy?.id ?? 0;
    this.age = copy?.age ?? 0;
    this.firstName = copy?.firstName ?? '';
    this.lastName = copy?.lastName ?? '';
    this.title = copy?.title ?? '';
    this.salutation = copy?.salutation ?? '';
  }

  public id: number;

  public age: number;

  public firstName: string;

  public lastName: string;

  public title: string;

  public salutation: string;
}

const options: GridOptions<DataSource> = {
  columns: [
    {
      field: 'id',
      name: 'ID',
    },
    {
      field: 'title',
      name: 'Title',
    },
    {
      field: 'salutation',
      name: 'Salutation',
    },
    {
      field: 'firstName',
      name: 'First Name',
    },
    {
      field: 'lastName',
      name: 'Last Name',
    },
    {
      field: 'age',
      name: 'Age',
      renderer: (element, value, context) => {
        element.replaceChildren(div({ class: 'shimmer', text: `${value}` }));
      },
    },
  ],
  virtualization: true,
};

const data: DataSource[] = new Array(1_000_000).fill(0).map(
  (_, i) =>
    new DataSource({
      id: i,
      age: faker.number.int({ min: 18, max: 70 }),
      title: faker.person.jobTitle(),
      salutation: faker.person.prefix(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    })
);

export function renderExample2(root: HTMLElement | null | undefined) {
  if (!root) {
    throw new Error('Root element not found');
  }

  const grid = new Grid(options);

  grid.attachTo(root);
  grid.setData(data);
}
