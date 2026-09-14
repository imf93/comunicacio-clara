# Palabra Viva

Aplicación web en español para crear preguntas con palabras predefinidas, votar mediante QR o enlace y ver una nube de palabras que cambia con las respuestas.

## Empezar en tu ordenador

1. Extrae el ZIP completo en una carpeta. No abras los archivos desde dentro del ZIP.
2. Instala [Node.js 24 o superior](https://nodejs.org/) si no lo tienes. En este ordenador, el lanzador también detecta el Node.js incluido con Codex.
3. Haz doble clic en **INICIAR.cmd**.
4. Mantén abierta esa ventana. Verás la dirección y la contraseña del organizador.
5. Abre **http://127.0.0.1:4173**, pulsa **Entrar como organizador** e introduce esa contraseña.
6. Pulsa **Probar con una pregunta de ejemplo** o **Nueva sesión**.
7. Escribe el título, la pregunta y las opciones, una por línea. Guarda y pulsa **Abrir votación**.
8. En **Resultados** puedes descargar el CSV y, en **Proyectar**, ver la nube a pantalla completa. Pulsa Esc para salir.

El ZIP incluye la aplicación compilada. Para usarla, basta Node.js 24: no necesitas instalar dependencias. Si el puerto ya está ocupado por la copia que he dejado abierta, utiliza esa copia o ciérrala antes de iniciar otra.

La contraseña se genera automáticamente la primera vez y se conserva en `.local/admin-key`. No compartas ese archivo ni lo subas a GitHub. Para escoger otra contraseña, copia `.env.example` como `.env` y configura `ADMIN_PASSWORD`.

## Participar desde un móvil

**La dirección 127.0.0.1 solo funciona en el ordenador que ejecuta la aplicación.** El QR local no es un enlace público.

Para probar en la misma Wi-Fi:
1. Copia `.env.example` como `.env`.
2. Pon `HOST=0.0.0.0` y una contraseña larga en `ADMIN_PASSWORD`.
3. Reinicia la aplicación.
4. Consulta la dirección IPv4 del ordenador con `ipconfig`, por ejemplo `192.168.1.50`.
5. Abre el panel desde **http://192.168.1.50:4173**. Así el QR contendrá esa dirección.
6. Si Windows lo solicita, permite el acceso solo en la red privada de confianza.
7. Conecta el móvil a la misma Wi-Fi y escanea el QR. Algunas redes de invitados aíslan los dispositivos.

Para participar desde cualquier lugar sin mantener tu PC encendido, despliega la aplicación en Internet. Se explica más abajo. No abras puertos del router para esta prueba.

## Qué guarda

- Sesiones con título, pregunta, estado y fecha de creación.
- Opciones, incluidas las que no reciben votos.
- Cada voto con su opción y fecha/hora UTC.
- Un identificador aleatorio de navegador para impedir votos repetidos.
- Resultados separados por sesión, recuentos y porcentajes.

En el ordenador, la base de datos está en **.local/votes.sqlite**. En Sites se utiliza D1. Los datos locales y los datos publicados son independientes; subir el código a GitHub no copia los votos.

Las opciones solo se pueden modificar en borrador. Una vez abierta la votación quedan fijadas. Puedes cerrar y reabrir la sesión; reabrir conserva sus votos.

## Protección y límites

- El panel, el histórico y la exportación requieren acceso de organizador.
- En local/Render se usa contraseña y una cookie de sesión de 12 horas. En Sites se utiliza el inicio de sesión de ChatGPT y cada organizador solo ve sus propias sesiones.
- Los participantes no necesitan cuenta ni introducir su nombre.
- Un navegador solo puede votar una vez en cada sesión. Borrar cookies, usar incógnito o cambiar de dispositivo permite volver a votar. No equivale a identificar personas.
- Las inserciones son atómicas y los reintentos no incrementan el recuento.
- La nube se actualiza cada 2 segundos; la pantalla de participación comprueba el estado cada 5 segundos. No utiliza conexiones WebSocket.
- Las palabras se distribuyen con saltos de línea para evitar solapamientos. Las opciones con cero votos aparecen en la tabla, no en la nube.
- La prueba automática cubre 24 participantes concurrentes y 10 reintentos simultáneos. No es una certificación de capacidad para eventos masivos.
- En Internet utiliza HTTPS y configura `PUBLIC_URL` con la URL real del servicio.

## Subir el proyecto a GitHub

GitHub guarda y versiona el código. **GitHub Pages no ejecuta este servidor ni su base de datos.**

### Con GitHub Desktop

1. Crea una cuenta en [GitHub](https://github.com/) si aún no tienes.
2. Instala [GitHub Desktop](https://desktop.github.com/) e inicia sesión.
3. Extrae el ZIP y elige **File → Add local repository**.
4. Selecciona la carpeta **palabra-viva**. Si Desktop indica que no es un repositorio, elige **create a repository here**.
5. Comprueba los archivos propuestos. Nunca deben aparecer `.local`, `.env`, contraseñas ni bases de datos. El archivo `.gitignore` ya los excluye.
6. Escribe un resumen como “Primera versión de Palabra Viva” y pulsa **Commit to main**.
7. Pulsa **Publish repository**, pon `palabra-viva` y mantén **Keep this code private** activado si no deseas compartir el código.
8. Pulsa **Publish repository**.

Para actualizar: modifica el código, comprueba los cambios en Desktop, escribe un resumen, pulsa **Commit to main** y **Push origin**.

### Con comandos

Desde la carpeta del proyecto, si aún no existe repositorio:

```powershell
git init
git add .
git commit -m "Primera versión de Palabra Viva"
git branch -M main
```

Crea un repositorio vacío en GitHub, sin README adicional. Sustituye TU_USUARIO por tu usuario:

```powershell
git remote add origin https://github.com/TU_USUARIO/palabra-viva.git
git push -u origin main
```

Si ya existe `origin`, revisa `git remote -v` antes de modificarlo. Para siguientes cambios:

```powershell
git add .
git commit -m "Describe el cambio"
git push
```

[Guía oficial de GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).

## Publicarla desde GitHub en Render

Se incluye un Dockerfile para alojarla con su propia contraseña de organizador. Esta es una alternativa independiente de Sites.

1. Sube el proyecto a GitHub siguiendo los pasos anteriores.
2. En [Render](https://render.com/), crea un **Web Service** y conecta ese repositorio.
3. Selecciona **Docker** como entorno y el Dockerfile de la raíz.
4. Elige una instancia de pago compatible con disco persistente. No uses la instancia gratuita para conservar esta base de datos.
5. Añade un disco de 1 GB con ruta **/app/data**.
6. Configura estas variables en Render:
   - `HOST`: `0.0.0.0`
   - `PORT`: `4173`
   - `DATA_DIR`: `/app/data`
   - `ADMIN_PASSWORD`: tu contraseña larga y única; no la escribas en GitHub.
   - `PUBLIC_URL`: la URL HTTPS asignada a tu servicio, sin barra final.
7. Despliega el servicio. Si conoces la URL después de crearlo, añade `PUBLIC_URL` y vuelve a desplegar.
8. Abre la URL, entra como organizador y crea una sesión.
9. Escanea el QR desde un móvil con Wi-Fi desactivado para comprobar que funciona por Internet.
10. Cierra la votación, exporta un CSV y comprueba el histórico después de reiniciar el servicio.

Precios consultados el 14/09/2026: la página de Render muestra una instancia de 512 MB desde **7 USD/mes** y discos a **0,25 USD/GB/mes**. Como orientación, 1 GB de disco más esa instancia serían **7,25 USD/mes**, antes de impuestos o consumos adicionales. Comprueba el precio final al contratar. No se ha contratado ningún servicio.

El disco persistente se conserva entre reinicios y despliegues, pero limita el servicio a una instancia y los despliegues pueden interrumpirlo brevemente. Fuentes: [precios](https://render.com/pricing), [discos persistentes](https://render.com/docs/disks) y [limitaciones del plan gratuito](https://render.com/docs/free).

## Publicación con Sites

El proyecto también genera un Worker compatible con Sites y usa D1 para los datos. El manifiesto `.openai/hosting.json` identifica el sitio registrado en esta tarea.

La publicación de esta copia está **pendiente de autorización**: la revisión automática bloqueó hacer público el sitio y emitir una credencial de escritura para el repositorio de Sites. No hay un enlace público de producción verificado.

Para continuar desde esta tarea, autoriza expresamente publicar Palabra Viva con acceso anónimo para participantes y utilizar la credencial temporal del repositorio de Sites. El panel seguirá requiriendo inicio de sesión.

## Copias de seguridad y restauración

### Copia de la base de datos local o de Render

Con Node.js 24, desde la carpeta de la aplicación:

```powershell
node --env-file-if-exists=.env scripts/backup.mjs
```

La copia consistente se crea en `backups/` con fecha y hora, incluso si el servidor sigue abierto. Guarda una copia fuera del ordenador o alojamiento. La carpeta backups está excluida de Git.

Para restaurar:
1. Detén el servidor y comprueba que ningún otro proceso utiliza la base de datos.
2. Copia la carpeta de datos completa a una carpeta de seguridad.
3. Aparta los archivos actuales `votes.sqlite`, `votes.sqlite-wal` y `votes.sqlite-shm`, si existen.
4. Copia la copia elegida a la carpeta de datos y renómbrala **votes.sqlite**.
5. Mantén el archivo `admin-key` original si quieres conservar el acceso local.
6. Inicia la aplicación y comprueba las sesiones y recuentos. Restaurar recupera el estado de la fecha de la copia.

En Render, ejecuta la copia en la Shell del servicio con el mismo `DATA_DIR` y descarga el archivo antes de otro despliegue. El Dockerfile incluye el script de copia. Un CSV es útil para análisis, pero no sustituye la copia completa de la base de datos.

La restauración de D1 en Sites utiliza las herramientas de administración de esa plataforma; no copies directamente una base SQLite al despliegue de Sites.

## Desarrollo y pruebas

Se utiliza React y TypeScript para la interfaz, Rolldown para compilar, Node.js 24 con SQLite para ejecutar en local y un adaptador D1 para Sites. El QR se genera dentro de la aplicación, sin enviar los enlaces a una web externa.

Para trabajar desde el código de GitHub:

```powershell
npm ci
npm run build
npm start
```

No se usa el servidor de desarrollo original de la plantilla. Después de cambiar el código, ejecuta `npm run build` y reinicia `npm start`.

Con la aplicación local iniciada y sin ADMIN_PASSWORD personalizado, ejecuta en otra ventana:

```powershell
npm test
npx tsc --noEmit
```

La prueba crea una sesión identificada como **PRUEBA AUTOMÁTICA** y votantes sintéticos. No la ejecutes contra sesiones reales. El script usa únicamente el servidor local.

El esquema está en `db/schema.ts` y las migraciones versionadas en `drizzle/`. No vuelvas a ejecutar el generador inicial sobre una base publicada. Para cambios posteriores genera una migración nueva con Drizzle y revisa su SQL.

Consulta **PRUEBAS.md** para las comprobaciones realizadas y sus límites.


## Actualización corporativa

La proyección incorpora los logotipos facilitados del Ayuntamiento de Sant Boi y de Comunicació Clara, utiliza azul corporativo, muestra la pregunta debajo de los logotipos y mantiene únicamente el QR como acceso de participación. Los textos públicos están en catalán. Se admiten entre 2 y 100 opciones. El panel de creación conserva su diseño.
