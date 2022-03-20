FROM openjdk:8
EXPOSE 8080
ADD target/currency-exchanger.jar currency-exchanger.jar
ENTRYPOINT ["java", "-jar", "/currency-exchanger.jar"]
