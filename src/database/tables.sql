CREATE TABLE IF NOT EXISTS USER (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    USERNAME VARCHAR(50) NOT NULL UNIQUE,
    EMAIL VARCHAR(100) NOT NULL UNIQUE,
    _HASH VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS TOKEN (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    USER_ID INT NOT NULL,
    TOKEN VARCHAR(100) NOT NULL,
    CREATION_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (USER_ID) REFERENCES USER(USER_ID)
);

CREATE TABLE IF NOT EXISTS STOCKS (
	ID INTEGER PRIMARY KEY AUTOINCREMENT,
	USER_ID INT NOT NULL,
	TICKER VARCHAR(50) NOT NULL UNIQUE,
	COUNT INT,
	FOREIGN KEY (USER_ID) REFERENCES USER(USER_ID)
);