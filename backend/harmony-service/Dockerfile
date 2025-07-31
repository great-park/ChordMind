FROM openjdk:17-jdk-slim

WORKDIR /app

# Gradle wrapper와 build 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

# 소스 코드 복사
COPY src src

# Gradle 빌드
RUN chmod +x gradlew
RUN ./gradlew build -x test

# 실행 가능한 JAR 파일 복사
RUN cp build/libs/*.jar app.jar

# 포트 노출
EXPOSE 8084

# 헬스체크를 위한 curl 설치
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"] 