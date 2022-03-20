FROM jdk:11.0.13
EXPOSE 8080
ADD target/jenkins-docker-integration.jar jenkins-docker-integration.jar
ENTRYPOINT ["java", "-jar", "/currency.jar"]
