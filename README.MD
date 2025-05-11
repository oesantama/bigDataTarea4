
Instrucciones:

**MongoDB:**
1. Asegúrese de tener una instancia de MongoDB ejecutándose.
2. Para poblar la base de datos `tiendaOnlineDB`:
   mongo tiendaOnlineDB mongodb/seedData.js
3. Para ejecutar las consultas de ejemplo (asegúrese de estar en la BD correcta):
   mongo tiendaOnlineDB mongodb/consultas_mongo.js
   O copie y pegue los bloques de consulta en el `mongo` shell interactivamente.

**HBase:**
1. Asegúrese de tener un clúster HBase (con HDFS y ZooKeeper) ejecutándose y accesible.
2. Inicie el `hbase shell`:
   hbase shell
3. Copie y pegue los comandos del archivo `hbase_files/comandos_hbase.txt` en el shell para crear la tabla,
   insertar datos de ejemplo y ejecutar las consultas.

Nota: La carga masiva de 100+ productos en HBase con comandos `put` individuales en el shell es ilustrativa.
En un escenario real, se usarían herramientas de ingesta masiva (Ej: ImportTSV, MapReduce, Spark, NiFi) o APIs.