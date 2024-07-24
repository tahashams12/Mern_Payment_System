import * as mysql from 'mysql';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pgsystem',
  };

export const connectToDatabase = () => {
    const connection = mysql.createConnection(dbConfig);
  
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        throw err; // Handle error as per your application's needs
      }
      console.log('Connected to MySQL database!');
    });
  
   return connection;
  
  };