# Image du service auth-service.
#
# Le jar est construit EN DEHORS de l'image (build multi-modules Maven à la
# racine du repo) puis simplement copié ici :
#   mvn -f ../pom.xml clean package -DskipTests
# C'est volontaire : le repo est un build multi-modules, recompiler chaque
# module dans son propre Dockerfile recompilerait le parent 7 fois.
FROM eclipse-temurin:26-jre-alpine

# Ne jamais tourner en root dans le conteneur.
RUN addgroup -S strife && adduser -S strife -G strife

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} /app.jar

USER strife
EXPOSE 8081
ENTRYPOINT ["java","-jar","/app.jar"]
