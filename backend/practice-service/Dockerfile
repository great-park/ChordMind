FROM openjdk:17-jdk-slim

WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

RUN chmod +x ./gradlew
RUN ./gradlew build -x test || return 0

COPY src src

RUN ./gradlew build -x test

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "build/libs/practice-service-0.0.1-SNAPSHOT.jar"] 