import psycopg2

class DatabaseConnection:
    def __init__(self, db_config):
        self.conn = None
        self.cur = None
        self.db_config = db_config

    def connect(self):
        try:
            self.conn = psycopg2.connect(
                database=self.db_config['database'],
                user=self.db_config['user'],
                password=self.db_config['password'],
                host=self.db_config['host'],
                port=self.db_config['port']
            )
            self.cur = self.conn.cursor()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)

    def disconnect(self):
        if self.cur is not None:
            self.cur.close()
        if self.conn is not None:
            self.conn.close()

    def execute_query(self, query, params=None):
        try:
            self.cur.execute(query, params)
            self.conn.commit()
            return self.cur.fetchall()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
            return None

    def fetch_one(self, query, params=None):
        try:
            self.cur.execute(query, params)
            return self.cur.fetchone()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
            return None

    def insert_row(self, bond_name, issuer, purchase_date, quantity, purchase_price):
        try:
            query = """
                INSERT INTO bonds (bond_name, issuer, purchase_date, quantity, purchase_price)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id;
            """
            self.cur.execute(query, (bond_name, issuer, purchase_date, quantity, purchase_price))
            self.conn.commit()
            return self.cur.fetchone()[0]  # Return the inserted row's ID
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
            return None

    def insert_new_bond(self, bond_name, issuer, purchase_date, quantity, purchase_price):
        try:
            self.connect()
            new_bond_id = self.insert_row(bond_name, issuer, purchase_date, quantity, purchase_price)
            if new_bond_id:
                print(f"New bond inserted with ID: {new_bond_id}")
            else:
                print("Error inserting bond")
            self.disconnect()
            return new_bond_id
        except Exception as e:
            print(f"Error: {e}")

    def get_all_bonds(self):
        try:
            query = """
                SELECT * FROM bonds;
            """
            self.connect()
            self.cur.execute(query)
            self.conn.commit()
            results = self.cur.fetchall()
            return [{
                'id': row[0], 
                'bond_name': row[1], 
                'issuer': row[2], 
                'purchase_date': row[3], 
                'quantity': row[4], 
                'purchase_price': row[5]} for row in results]
        except (Exception, psycopg2.DatabaseError) as error:
            print(error, flush=True)
            return None