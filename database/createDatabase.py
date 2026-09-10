import sqlite3
db = sqlite3.connect('db.sqlite')

db.execute('''CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    profile_pic TEXT
)''') #users table, email might be login method or username

#bookId use a random function to generate id with preset format
#bookDateEnd not necessary for other services except pet hotel
db.execute('''CREATE TABLE IF NOT EXISTS hotelBookings (
            hId INTEGER PRIMARY KEY AUTOINCREMENT, 
            userId INTEGER NOT NULL,
            bookDateStart DATE NOT NULL,
            bookDateEnd DATE NOT NULL,
            FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE 
)''')

db.execute('''CREATE TABLE IF NOT EXISTS groomBookings (
            gId INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            petType TEXT NOT NULL, 
            bookDate DATE NOT NULL,
            FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE 
)''') #pet type is cat, small dog, medium dog, large dog

db.execute('''CREATE TABLE IF NOT EXISTS appointments (
            aId INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            bookDate DATE NOT NULL,
            FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
)''')

cursor = db.cursor()

#dummy data for testing.
cursor.execute('''Insert into users (username, email, password) values 
               ("John Example", "johne@gmail.com", "123345"),
               ("Jane Example", "janee@gmail.com", "123456"),
               ("John UTAR", "johnu@gmail.com", "111111")''')

cursor.execute('''INSERT INTO hotelBookings (userId, bookDateStart, bookDateEnd) VALUES 
               (1, "2026-10-10", "2026-10-15"),
               (1, "2026-11-01", "2026-11-05")''')

cursor.execute('''INSERT INTO groomBookings (userId, petType, bookDate) VALUES
               (1, "Small Dog", "2026-09-20"),
               (2, "Large Dog", "2026-10-01")''')

cursor.execute('''INSERT INTO appointments (userId, bookDate) VALUES
               (1, "2026-09-25"),
               (2, "2026-10-05")''')

db.commit()
db.close()