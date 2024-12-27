import { databaseDefaultSerializer, globalDatabaseOptions } from "vuefire";

globalDatabaseOptions.serialize = databaseDefaultSerializer;
