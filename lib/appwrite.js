import { Account, Avatars, Client, ID, Databases, Query } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.proyectofinal.matekl',
    projectId: '66d4d9f7000ae6fab09f',
    databaseId: '66d4dba900184a0f5100',
    userCollectionId: '66d4dbc6001c263a58c1',
    ejercicioCollectionId: '66ea44f1003921ffecfa',
    storageId: '66d4dc91003701d50631'
}

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ejercicioCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ejercicioCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ejercicioCollectionId,
      [Query.search("titulo", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function searchPostsbyCat(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ejercicioCollectionId,
      [Query.search("categoria", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function searchPostsbyLv(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ejercicioCollectionId,
      [Query.equal("dificultad", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ejercicioCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateUserScore(accountId, newScore) {
  try {
    const userDocument = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal('$id', accountId) 
      ]
    );
    if (userDocument.total === 0) {
      throw new Error('Usuario no encontrado');
    }
    const userId = userDocument.documents[0].$id; 
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId, 
      {
        score: newScore
      }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(`Error actualizando el score: ${error.message}`);
  }
}

export async function getUserScore(accountId) {
  try {
    const userDocument = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal('$id', accountId)  
      ]
    );
    if (userDocument.total === 0) {
      throw new Error('Usuario no encontrado');
    }
    const user = userDocument.documents[0]; 
    return user.score;
  } catch (error) {
    throw new Error(`Error obteniendo el score: ${error.message}`);
  }
}

export async function markExerciseAsResolved(accountId, ejercicioId) {
  try {
    // Buscar el documento del usuario actual
    const userDocument = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', accountId)]
    );

    if (userDocument.total === 0) {
      throw new Error('Usuario no encontrado');
    }

    const user = userDocument.documents[0];

    // Obtener la lista actual de ejercicios resueltos (que son IDs de documentos)
    const resolvedExercises = user.resolvedExercises || [];

    // Verificar si el ejercicio ya está en la lista de resueltos
    if (!resolvedExercises.includes(ejercicioId)) {
      resolvedExercises.push(ejercicioId);  // Añadir el ID del documento del ejercicio resuelto
    }

    // Actualizar el documento del usuario con la nueva lista de ejercicios resueltos (como referencia a documentos)
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.$id,
      { resolvedExercises }
    );

    return updatedUser;
  } catch (error) {
    throw new Error(`Error marcando el ejercicio como resuelto: ${error.message}`);
  }
}


export async function getResolvedExercises(accountId) {
  try {
    const userDocument = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('$id', accountId)]
    );

    if (userDocument.total === 0) {
      throw new Error('Usuario no encontrado');
    }

    const user = userDocument.documents[0];
    return user.resolvedExercises || [];
  } catch (error) {
    throw new Error(`Error obteniendo los ejercicios resueltos: ${error.message}`);
  }
}

