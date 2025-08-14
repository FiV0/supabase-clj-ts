FROM eclipse-temurin:21

ENTRYPOINT ["java", \
    "-Dclojure.main.report=stderr", \
    "-Dlogback.configurationFile=logback.xml", \
    "-cp","supabase-clj-ts.jar", \
    "clojure.main", "-m", "main"]


# CMD ["config/staging.edn"]

EXPOSE 8081

ARG GIT_SHA
ENV GIT_SHA=${GIT_SHA}

LABEL org.opencontainers.image.revision=${GIT_SHA}

ADD target/supabase-clj-ts.jar supabase-clj-ts.jar
