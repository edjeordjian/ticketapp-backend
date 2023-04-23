- Las dependencias se instalan con npm i


### Firebase
- Configuración del lado del servidor
  https://firebase.google.com/docs/admin/setup

- Dashboard
https://console.firebase.google.com/u/0/project/ticketapp-firebase/overview

- Consumo
https://console.firebase.google.com/u/0/project/ticketapp-firebase/authentication/usage/current-billing


### Render
- Consumo:
https://dashboard.render.com/billing#payment-method

### Sequelize
- Relaciones many to many
https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/


### Errores Frecuentes
-Para matar la app corriendo en un puerto (ejemplo: 4481)
kill $(lsof -i :4481 | cut -d ' ' -f5)

- Para matar un ngrok colgado
killall ngrok
