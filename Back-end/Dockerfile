FROM adoptopenjdk/openjdk15:alpine-jre

ENV JAVA_ENABLE_DEBUG=${JAVA_ENABLE_DEBUG}

COPY build/libs/admissionapp-*.jar admissionapp.jar
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

RUN addgroup --system --gid 1001 appuser && \
    adduser --system --ingroup appuser --uid 1001 appuser

RUN chown appuser:appuser admissionapp.jar
RUN chmod 500 admissionapp.jar

EXPOSE 8080

USER 1001

CMD ["./entrypoint.sh"]
