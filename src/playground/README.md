# Hooks en React 19 – Práctica

## 👥 Integrantes
- Yohan Barbosa
- Fraider Tarazona
- Mateo Pallares

## 📌 Hooks asignados
- Yohan Barbosa → useActionState, useCallback, useDeferredValue, useImperativeHandle, useLayoutEffect, useReducer
- Fraider Tarazona → useContext, useDebugValue, useEffect, useFormStatus, useInsertionEffect, useRef
- Mateo Pallares → useId, useMemo, useOptimistic, useSyncExternalStore, useTransition

---

## 📖 Explicación personal de los ejercicios

### 🔹 useActionState
en este ejemplo lo que se hizo fue manejar el estado de un formulario de manera automática, ya que ejecuta una función cada vez que se envía el formulario y actualiza el estado con el resultado de esa acción; además, mientras la acción está en proceso, provee un indicador (isPending) para mostrar un mensaje de carga, lo que facilita implementar flujos donde se necesita reflejar en la interfaz lo que sucede después de enviar datos, como en el ejemplo donde al escribir un producto y enviarlo aparece un mensaje tipo “Agregaste Leche”.

### 🔹 useCallback
este hook se encarga de memorizar funciones para evitar que se vuelvan a crear en cada renderizado. Se tienen tres funciones (fn1, fn2 y fn3) que dependen de distintos valores: fn1 no tiene dependencias y siempre es la misma, fn2 se actualiza solo cuando cambia la variable count, y fn3 solo cuando cambia la variable text. Además, se define increment, que hace que se incremente el contador y ademas esta depende de count. Gracias a useCallback, React no recrea las funciones innecesariamente en cada render, lo que optimiza el rendimiento en casos donde se pasan como props a componentes hijos.

### 🔹 useContext
permite compartir el valor del tema (light o dark) entre varios componentes sin necesidad de pasarlo manualmente como prop. dentro del HookUseContext se define un estado theme y una función toggleTheme para cambiar entre claro y oscuro. Ese valor se agarra en un <ThemeContext.Provider>, de modo que los componentes hijos pueden acceder a él. Los componentes Boton y Boton2 usan el valor del contexto usando useContext(ThemeContext) y cambian el estilo de acuerdo al  actual.

### 🔹 useDebugValue

en este se simula el estado de conexión de un usuario. Inicialmente, isOnline está en false, y mediante un useEffect se cambia a true después de 3 segundos, como si el usuario se conectara. El hook utiliza useDebugValue para mostrar en las DevTools de React, depues hay una etiqueta más clara: "🟢 Online" o "🔴 Offline", que sirve como ayuda de depuración. Luego, el componente HookDebugValue usa este hook y muestra en pantalla si el usuario está conectado o desconectado. 

### 🔹 useDeferredValue

hay una lista de 20 mil que va desde el 1 hasta el 20 mil y se filtran en función de lo que el usuario escribe en el input de búsqueda. La cosa está en el hook useDeferredValue(query), que crea una versión  de la variable query.lo que hace que mientras el usuario escribe, React no bloquea la interfaz al recalcular el filtrado pesado inmediatamente, sino que puede mostrar la entrada de texto al instante y atrasar un poco la actualización de la lista. 

### 🔹 useEffect

se trata simular un sistema de conexión/desconexión. El estado connected indica si el usuario está conectado o no. Al montar el componente, el hook useEffect se ejecuta y llama a connect(), el cual hace una conexión automáticamente. dentro del mismo useEffect se creao una función de limpieza (return () => disconnect();) que se ejecuta cuando el componente se baja, asegurando que se cierre la conexión correctamente

### 🔹 useFormStatus

en este hay un formulario que envía un dato con retraso. El hook useFormStatus se usa dentro del componente SubmitButton para detectar si el formulario está en estado de envío (pending). Cuando el usuario hace clic en el botón, React marca el formulario como pendiente: el botón se desactiva (disabled) y su texto cambia a "Enviando...". Una vez que la acción handleAction termina (tras esperar 2 segundos con setTimeout), se actualiza el estado  message mostrando el valor ingresado

### 🔹 useId

en este ejemplo cada vez que se renderiza un campo de entrada, se llama a useId() para crear un ID único y estable, evitando colisiones incluso si el componente se usa varias veces en la misma página. Ese ID se asigna al atributo id del input y al htmlFor del label, lo que asegura que la etiqueta esté correctamente vinculada con su campo de texto, En el componente principal HookUseId, se muestran dos inputs —Nombre y Correo—, cada uno con su propio ID generado automáticamente. Esto garantiza que aunque se usen varios InputWithLabel, cada input mantiene su relación única con su label

### 🔹 useImperativeHandle

En el código, el componente Modal maneja internamente el estado isOpen para determinar si se muestra o no en pantalla. Con useImperativeHandle(ref, () => ({ open, close })), el modal muestra al padre dos métodos (open y close) que actualizan su estado. De esta manera, el componente padre (HookUseImperativeHandle) puede abrir o cerrar el modal usando modalRef.current.open() o modalRef.current.close()

### 🔹 useInsertionEffect

En el componente DynamicStyledBox, cada vez que cambia la prop color, el hook crea un elemento style y lo inserta en el head del documento, aplicando un fondo dinámico a la clase .dynamic-box. Cuando el componente se baja o el color cambia, el estilo anterior se elimina para evitar acumulación de reglas.El componente principal App controla el estado color y ofrece un botón para cambiar entre el color lightblue y lightgreen

### 🔹 useLayoutEffect

En este lo que se hace es que  el componente simula un pequeño chat. Cada vez que cambia el estado messages (cuando se agrega un nuevo mensaje), useLayoutEffect se asegura de ajustar el scroll del contenedor (chatRef) hasta el final, de forma que el usuario siempre vea el último mensaje sin tener que desplazarse manualmente.

### 🔹 useMemo

se define una función calculoPesado que simula un cálculo muy demandante, y su resultado se memoriza con useMemo para que solo se vuelva a ejecutar cuando cambie el valor de contador. De esta manera, si el usuario interactúa con otros elementos del componente, como el input valor, el cálculo no se repite , lo que evita renders lentos

### 🔹 useOptimistic

hay una lista de comentarios que, al añadir uno nuevo, se muestra de forma inmediata en pantalla (estado optimista) gracias a addOptimisticComment, sin esperar a que finalice la operación simulada con un setTimeout. Una vez completada la espera, el comentario se guarda en el estado real comments

### 🔹 useReducer

Se define un reducer (counterReducer) que recibe el estado actual y una acción, y según el tipo de acción (increment, decrement o reset) devuelve un nuevo estado. En el componente principal, useReducer devuelve el estado (state) y la función dispatch, que permite enviar acciones al reducer. Así, los botones llaman a dispatch con la acción correspondiente para modificar el contador

### 🔹 useRef

en este ejemplo se usa useRef para mantener un valor persistente entre renders sin causar que el componente se vuelva a renderizar. Aquí, ref.current se inicializa en 0 y cada vez que se hace clic en el botón, su valor se incrementa y se muestra en un alert.

### 🔹 useSyncExternalStore

En este se define un counterStore  que guarda un número (count) y notifica a suscriptores cada vez que cambia.
En el componente, React escucha los cambios de la "fuente externa" y se vuelve a renderizar solo cuando el valor realmente cambia. Así, el contador se mantiene siempre sincronizado con el store, incluso si hay múltiples componentes usando ese mismo estado.

### 🔹 useTransition

En este ejemplo, se pede escribir en un campo de texto y la aplicación filtra una lista muy grande de 5000 elementos. Gracias a useTransition, el filtrado se ejecuta como una tarea en segundo plano, manteniendo la entrada de texto rápida y sin retrasos. El estado isPending permite mostrar un mensaje de “Filtrando…” mientras la lista se actualiza


