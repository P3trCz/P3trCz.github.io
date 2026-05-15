export type User = {
  id: string;
  username: string;
  email: string;
  password?: string;
};

// Lokální paměťová databáze, pro perzistenci bychom použili localStorage nebo backend
let users: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@streamhub.cz',
    password: 'heslo123',
  },
  {
    id: '2',
    username: 'jan.novak',
    email: 'jan.novak@example.com',
    password: 'jan1234',
  },
  {
    id: '3',
    username: 'petra.svobodova',
    email: 'petra.svobodova@example.com',
    password: 'petra1234',
  },
  {
    id: '4',
    username: 'martin.dvorak',
    email: 'martin.dvorak@example.com',
    password: 'martin1234',
  },
  {
    id: '5',
    username: 'lucie.kralova',
    email: 'lucie.kralova@example.com',
    password: 'lucie1234',
  },
];

export const usersDb = {
  getUsers: () => users,
  
  findUserByEmail: (email: string) => 
    users.find(u => u.email.toLowerCase() === email.toLowerCase()),
    
  findUserByUsername: (username: string) => 
    users.find(u => u.username.toLowerCase() === username.toLowerCase()),
    
  createUser: (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: Math.random().toString(36).substr(2, 9) };
    users.push(newUser);
    return newUser;
  },
  
  updatePassword: (email: string, newPassword: string) => {
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      return true;
    }
    return false;
  }
};
