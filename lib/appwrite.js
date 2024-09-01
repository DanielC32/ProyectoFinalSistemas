import { Account, Avatars, Client, ID, Databases } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.proyectofinal.matekl',
    projectId: '66d4d9f7000ae6fab09f',
    databaseId: '66d4dba900184a0f5100',
    userCollectionId: '66d4dbc6001c263a58c1',
    storageId: '66d4dc91003701d50631'
}

const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if (!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser;

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}

export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession
            (email, password)

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

