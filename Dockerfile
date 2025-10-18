ARG TARGETPLATFORM
FROM --platform=$TARGETPLATFORM node:21-bullseye-slim
LABEL maintainer="https://github.com/sdedovic"

# Install wget and ca-certificates for downloading Temurin
RUN apt-get update && \
    apt-get install -y wget ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Set architecture-specific variables
ARG TARGETARCH
ENV TARGETARCH=${TARGETARCH}

# Download and install Eclipse Temurin JRE based on architecture
RUN if [ "$TARGETARCH" = "amd64" ]; then \
        TEMURIN_URL="https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.5%2B11/OpenJDK21U-jre_x64_linux_hotspot_21.0.5_11.tar.gz"; \
        JRE_DIR="jre"; \
    elif [ "$TARGETARCH" = "arm64" ]; then \
        TEMURIN_URL="https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.5%2B11/OpenJDK21U-jre_aarch64_linux_hotspot_21.0.5_11.tar.gz"; \
        JRE_DIR="jre-arm64"; \
    else \
        echo "Unsupported architecture: $TARGETARCH" && exit 1; \
    fi && \
    wget -O /tmp/temurin.tar.gz "$TEMURIN_URL" && \
    mkdir -p /necesse-server/$JRE_DIR && \
    tar -xzf /tmp/temurin.tar.gz -C /necesse-server/$JRE_DIR --strip-components=1 && \
    rm /tmp/temurin.tar.gz

COPY ./necesse-server /necesse-server
COPY ./necesse-wrapper.js /necesse-server
RUN chmod -R +x /necesse-server

# Set default JVM memory options (can be overridden at runtime)
ENV JVM_MIN_MEMORY=512M
ENV JVM_MAX_MEMORY=2G

ENTRYPOINT ["node", "/necesse-server/necesse-wrapper.js"]
