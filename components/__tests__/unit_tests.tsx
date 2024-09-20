import UserContent from "../../app/(tabs)/index";
import addLocalUser from "../../app/(tabs)/index"

import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { SQLiteAnyDatabase } from "expo-sqlite/build/NativeStatement";


interface NewTestUser {
    username: string;
    password: string;
}

//HomeScreen();

test('User can create a new account', async ()=> {

    console.log("running test");
    const newUser: NewTestUser = {
        username: "test-user",
        password: "test-password"
    }
    console.log("About to add user");

    addLocalUser(newUser);//fails here

    console.log("passed add user");
    const db = useSQLiteContext();
    const result = await db.execAsync(`
        SELECT password
        FROM users
        WHERE username = 'test-user'`);

    console.log(result);

    
    
    
}
);