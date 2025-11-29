# Autenticación con Google – Firebase + React

En este documento explicaré la configuración, requisitos y la integración del inicio de sesión en Google utilizando Firebase y React.

Requisitos para usar la funcion:

- Proyecto en Firebase configurado
- Authentication habilitada
- Método de inicio con el proveedor Google activado
- Dependencias instaladas:
bash
npm install firebase sweetalert2
npm isntall firebase


Configuracion en firebase:

- Authentication -> metodos de acceso -> agregar proveedor nuevo
- Seleciona Google
- Activa el proveedor y guardalo

Configuracion en el proyecto de react

- Importar el proveedor en el archivo firebase.js y luego inicializarlo. 
Ejemplo:

import { GoogleAuthProvider } from "firebase/auth" -> importar
const GoogleProvider = new GoogleAuthProvider() -> inicializar

- importa el proveedor y el metodo para iniciar sesion:
  GoogleProvider -> de tu archivo de firebase
  signInWithPopup -> de la libreria firebase/auth

- Importar el proveedor y el metodo para vicular con el metodo:
  GoogleProvider -> de tu archivo de firebase
  linkWithPopup -> de la libreria firebase/auth

Integracion en el proyecto

- Vamos a crear una funcion asincrona donde la llamaremos  con el metodo onClick desde el boton
donde este la opcion de iniciar con google.

- Hacemos un llamado a la funcion en donde le pasamos el usuario autentificado y el proveedor :
  await signInWithPopup(auth, GoogleProvider);

- Se recomienda que se manejen los posibles errores con un trycatch

- Hay que aclara que para poder hacer una vinculación de este método cuando  ya existe un usuario en los registros de firebase , se debe de hacer una vez este logueado el usuario, ya que firebase es sensible con las credenciales y no permite hacer una vinculación sin que se envie el usuario ya autentificado.
  el flujo es : loguearse -> luego vincular el método

- Forma de uso: en nuestro caso lo manejamos en la componente topbar y desde ahí mostramos la opción de vincular con google mediante una función asincrona y dentro de esta hacemos el llamado del método :
  await linkWithPopup(auth.currentUser, google)

- Luego de esto ya vamos a poder  vincular nuestra cuenta con el proveedor de Google.
