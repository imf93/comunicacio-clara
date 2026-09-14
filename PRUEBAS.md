# Verificación de Palabra Viva

## Pruebas automáticas

16 pruebas de API superadas en el servidor local con SQLite:
- Rechazo de acceso anónimo y cabeceras de identidad falsificadas.
- Validación de opciones repetidas.
- Creación y edición en borrador.
- Participantes sin acceso al propietario ni a los resultados privados.
- Votación bloqueada antes de abrir.
- Rechazo de opciones inexistentes.
- Diez reintentos simultáneos del mismo navegador contabilizados una sola vez.
- Veinticuatro participantes adicionales simultáneos, sin pérdida de votos.
- Recuerdo del voto por cookie y consulta al servidor.
- Bloqueo de edición tras abrir.
- Rechazo de cambios desde otro origen.
- Bloqueo de votos al cerrar.
- CSV con opciones sin votos, acentos y neutralización de fórmulas.
- Exportación protegida.
- Generación del QR SVG.

Comprobación TypeScript: sin errores.

## Pendiente de validación externa

No se ha realizado una prueba física escaneando el QR con un móvil ni una prueba de carga masiva. La publicación en Internet está pendiente de autorización. La imagen Docker no se ha construido en este entorno; comparte el código del servidor probado localmente.


## Actualització corporativa (1.1)

Compilació i TypeScript correctes. Prova de 100 opcions desades i rebuig de 101. Logotips servits correctament. Pantalla pública revisada en català. Projecció comprovada a pantalla completa: 100 textos, 0 superposicions detectades, 0 enllaços i 0 botons. QR visible dins de la pantalla.
