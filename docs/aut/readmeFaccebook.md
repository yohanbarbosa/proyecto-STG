# Autenticación con Facebook – Firebase + React

En este documento se explica la configuración, requisitos e integración del inicio de sesión con **Facebook** utilizando Firebase y React.

---

## 📌 Requisitos para usar la funcion

- Proyecto en Firebase configurado
- Authentication habilitado
- Método de inicio con el proveedor Facebook activado
- Dependencias instaladas:

```bash
npm install firebase sweetalert2
npm isntall firebase
```

## ⚙️ Configuracion en firebase

- Authentication -> metodos de acceso -> agregar proveedor nuevo
- Seleciona **Facebook**
- Activa el proveedor y guardalo

## 🧩 Configuracion en el proyecto de react

- Importar el proveedor en el archivo firebase.js y luego inicializarlo. ejemplo

import { FacebookAuthProvider } from "firebase/auth" -> importar
const providerFacebook = new FacebookAuthProvider(); -> inicializar

- importa el proveedor y el metodo para iniciar sesion:
  providerFacebook -> de tu archivo de firebase
  signInWithPopup -> de la libreria firebase/auth

- Importar el proveedor y el metodo en el topBar para vicular con el metodo:
  providerFacebook -> de tu archivo de firebase
  linkWithPopup -> de la libreria firebase/auth

## 🔐 Integracion en el proyecto

- Crea una funcion asincrona donde la llames con el metodo onClick desde el boton
  donde este la opcion de iniciar con facebook

- haces un llamado a la funcion en donde le pasas el usario y el proveedor :
  await signInWithPopup(auth, providerFacebook);

- es recomendable que se manejen los posibles errores con un trycatch

- se debe de aclara que para poder hacer una viculacion de este metodo cuando
  ya existe un usuario en los registros de firebase ,
  se debe de hacer una vez este logueado el usuario.
  ya que firebase es sensible con las credenciales y no permite hacer una
  vinculacion sin que se envie el usario ya autentificado.
  el flujo es : loguearse -> luego vincular el metodo

- forma de uso: en nuestro caso lo manejamos en la componente topbar
  y desde este mostramos la opcion de vicular con facebook mediante una
  funcion asincrona y dentro de esta hacemos el llamado del metodo :
  await linkWithPopup(auth.currentUser, facebook)

- luego de esto ya puedes vincular tu cuenta con el proveedor de **Facebook**
