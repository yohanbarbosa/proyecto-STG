# Hooks en React 19 – Práctica

## 👥 Integrantes
- Yohan Barbosa
- Fraider Tarazona
- Mateo Pallares

## 📌 Hooks asignados
- Yohan Barbosa → useActionState, useCallback
- Fraider Tarazona → useContext, useDebugValue
- Mateo Pallares → useEffect, useId

---

## 📖 Explicación personal de los ejercicios
### 🔹 useActionState
en este ejemplo lo que se hizo fue manejar el estado de un formulario de manera automática, ya que ejecuta una función cada vez que se envía el formulario y actualiza el estado con el resultado de esa acción; además, mientras la acción está en proceso, provee un indicador (isPending) para mostrar un mensaje de carga, lo que facilita implementar flujos donde se necesita reflejar en la interfaz lo que sucede después de enviar datos, como en el ejemplo donde al escribir un producto y enviarlo aparece un mensaje tipo “Agregaste Leche”.

### 🔹 useCallback
Sirve para memorizar funciones y evitar que se vuelvan a crear en cada render.  
En mi caso lo usé en una lista donde al hacer clic en un ítem se selecciona, y evité que la función `handleSelect` se recreara innecesariamente.

---

## 📊 Tabla general de hooks

| Hook                  | Descripción corta                                                     | Categoría        |
|-----------------------|-----------------------------------------------------------------------|------------------|
| useState              | Manejo de estado local en un componente                               | Estado           |
| useEffect             | Ejecutar efectos secundarios (fetch, timers, etc.)                    | Efectos          |
| useContext            | Compartir datos entre componentes sin pasar props                     | Contexto         |
| useReducer            | Manejo de estados complejos con acciones y reducer                    | Estado           |
| useCallback           | Memoriza funciones para evitar renders innecesarios                   | Memorización     |
| useMemo               | Memoriza valores calculados                                           | Memorización     |
| useRef                | Referencias mutables que no causan renderizados                       | Referencias      |
| useId                 | Genera IDs únicos para accesibilidad y formularios                    | Identificación   |
| useImperativeHandle   | Expone métodos personalizados en refs                                 | Referencias      |
| useInsertionEffect    | Efectos sincronizados para estilos                                    | Efectos          |
| useDeferredValue      | Retrasa valores no urgentes                                           | Rendimiento      |
| useDebugValue         | Muestra información personalizada en React DevTools                   | Debugging        |
| useActionState        | Manejo del estado de acciones asíncronas                              | Estado / Acciones|
| useOptimistic         | Manejo de actualizaciones optimistas en la UI                         | Estado / UX      |
| useNavigate           | Navegación entre rutas en React Router                                | Routing          |
| useTransition         | Manejo de transiciones de estado sin bloquear la UI                   | Rendimiento      |
| useLayoutEffect       | Igual a useEffect pero se ejecuta antes de pintar                     | Efectos          |
| useSyncExternalStore  | Suscripción a estados externos con actualizaciones seguras            | Estado / Store   |
| useFormStatus         | Indica el estado actual de un formulario (ej. enviando, error, éxito) | Formularios      |

---

