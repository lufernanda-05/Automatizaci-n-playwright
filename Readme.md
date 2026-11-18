# Laboratorio de automatización con Playwright y TypeScript

## Datos del estudiante

- Nombre: [luisa bernal ]
- Asignatura: Ingeniería de Software III
- Aplicación del reto: Ghost 6.69.0, entorno local con Docker

## 1. Lo trabajado en clase

En el laboratorio de SauceDemo aprendí a configurar Playwright con TypeScript, crear pruebas, usar locators, organizar casos, aplicar Page Object Model, crear fixtures, usar variables de entorno y generar reportes y evidencias.

## 2. Reto integrador: Ghost

### 2.1 Aplicación escogida

Ghost 6.69.0 ejecutado localmente con Docker.  
URL: http://localhost:2368

### 2.2 Historias de usuario

- HU-01: acceso del personal al panel.
- HU-02: búsqueda pública de publicaciones.
- HU-03: acceso de miembros mediante correo y código.

### 2.3 Casos automatizados

| ID | HU | Nombre | Datos | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|---|
| GH-CP-001 | HU-01 | Login válido del propietario | owner@ghost.test | Entra al panel | [completar con el resultado real] |
| GH-CP-002 | HU-01 | Login con contraseña incorrecta | Contraseña de prueba incorrecta | Rechaza el acceso y muestra error | [completar] |
| GH-CP-003 | HU-01 | Panel sin sesión | URL /ghost | Muestra el formulario de acceso | [completar] |
| GH-CP-004 | HU-02 | Búsqueda con resultados | soft | Aparece la publicación de calidad | [completar] |
| GH-CP-005 | HU-02 | Búsqueda sin resultados | bebel | Muestra “No matches found” | [completar] |
| GH-CP-006 | HU-03 | Acceso de miembro con código | miembro1@ghost.test | Inicia sesión con código de Mailpit | [completar] |

### 2.4 Cómo está construido

- `reto/pages/`: Page Objects de Ghost.
- `reto/fixtures.ts`: fixtures del reto.
- `reto/utils/mailpit.ts`: consulta Mailpit y extrae el código de acceso.
- `reto/tests/`: pruebas automatizadas.
- `utils/acciones.ts`: acciones compartidas para pasos y capturas.
- `evidencias/`: capturas generadas durante las pruebas.

### 2.5 Evidencias

Incluye las capturas relevantes generadas durante las pruebas y escribe la ruta de cada archivo:

- Login del propietario: [evidencias/GH-CP-001@smoke@login]
- Búsqueda: [evidencia/GH-CP-004@SMOKE@busqueda]
- Acceso del miembro: [evidencias/GH-CP-006@smoke@miembros]


## 3. Cómo ejecutar

1. Iniciar Ghost desde la carpeta `ghost_blog`:

   `docker compose up -d`

2. Abrir `curso-playwright` e instalar dependencias:

   `npm install`

3. Instalar Chromium si hace falta:

   `npx playwright install chromium`

4. Crear `.env` a partir de `.env.example` y completar las variables localmente.

5. Ejecutar el reto:

   `npx playwright test --project=ghost`

6. Abrir el reporte:

   `npx playwright show-report`

## 4. Dificultades y cómo las resolví

- Dificultad: todas lass pruebas no pasaron al principio por una configuracion en el archivo  y dependencias que no tenia y ponia en ghost_blog que solo es para levantar el ambiente y en el curso si es paa correr e instalar dependencias y demas. 
-  Algunos locators de ejemplo no coincidían con mi instalación de Ghost lo cual Usé Codegen y Pick locator para verificar los elemento.
-  Mailpit conserva correos anteriores, por lo que la prueba podía tomar un código vencido. Solución: Añadí una función para limpiar Mailpit antes de pedir un código nuevo y extraer el código del asunto del mensaje.

## 5. Conclusiones

Separé las pruebas del reto en reto/, configuré un proyecto Playwright con TypeScript y creé Page Objects para el panel, la página pública y el portal de miembros. Las credenciales están en .env, y la prueba del miembro consulta Mailpit para recuperar el código de acceso. Automaticé casos positivos y negativos de login, búsqueda y acceso de miembros. Playwright genera un reporte HTML de evidencias el cual se almacena en la carpeta y se vera al correr el reporte (**npx playwright show-report**)
ejecutado localmente con Docker, usando Playwright y TypeScript. Al finalizar, pasaron las seis pruebas de Ghost y las siete pruebas de SauceDemo de clase; el reporte HTML confirmó los resultados. También subí el proyecto a GitHub sin incluir el archivo .env ya que contiene las claves y en archivo privado.
