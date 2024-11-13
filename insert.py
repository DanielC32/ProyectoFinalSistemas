import json
import requests
from appwrite.id import ID

# Configuración de Appwrite
APPWRITE_PROJECT_ID = '66d4d9f7000ae6fab09f'
COLLECTION_ID = '66ea44f1003921ffecfa'
APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1'
databaseId = '66d4dba900184a0f5100'
# Leer el archivo JSON
with open('ejercicios.json', 'r', encoding='utf-8') as file:
    ejercicios = json.load(file)

    print(ejercicios)

# Agregar cada ejercicio como documento en Appwrite
headers = {
    'X-Appwrite-Project': APPWRITE_PROJECT_ID,
    'Content-Type': 'application/json'
}

for ejercicio in ejercicios:
    data = {
        "titulo": ejercicio["titulo"],
        'ejercicio': ejercicio["ejercicio"],
        'dificultad': ejercicio['dificultad'],
        'categoria': ejercicio['categoria']
    }

    response = requests.post(
        f"{APPWRITE_ENDPOINT}/databases/{databaseId}/collections/{COLLECTION_ID}/documents",
        headers=headers,
        json={"documentId": ID.unique(),
            'data': data}
    )

    if response.status_code == 201:
        print(f"Ejercicio '{ejercicio['titulo']}' insertado con éxito.")
    else:
        print(f"Error al insertar '{ejercicio['titulo']}': {response.text}")
