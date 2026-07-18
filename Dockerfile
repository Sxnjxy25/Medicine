# Stage 1: Build the Spring Boot application
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the backend project
COPY backend/ .

# Make the maven wrapper executable and fix CRLF line endings
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Build the JAR (skip tests for faster deploy)
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/medistock-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port Render will use
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar", "--server.port=8080"]
