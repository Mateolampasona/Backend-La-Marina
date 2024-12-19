import { connectionSource } from '../Config/data-source';
import { User } from '../Users/entity/user.entity';

const users = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashedPassword1',
    authProvider: 'local',
    createdAt: new Date(),
    orders: [],
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'hashedPassword2',
    authProvider: 'local',
    createdAt: new Date(),
  },
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    password: 'hashedPassword3',
    authProvider: 'local',
    createdAt: new Date(),
  },
  {
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    password: 'hashedPassword4',
    authProvider: 'local',
    createdAt: new Date(),
  },
  {
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    password: 'hashedPassword5',
    authProvider: 'local',
    createdAt: new Date(),
  },
];

async function createUsers() {
  const dataSource = await connectionSource.initialize();
  const userRepository = dataSource.getRepository(User);

  try {
    for (const user of users) {
      const newUser = userRepository.create(user);
      await userRepository.save(newUser);
    }
    console.log('Users created successfully');
  } catch (error) {
    console.log('Error creating users', error);
  } finally {
    await dataSource.destroy();
  }
}

createUsers();
