FROM golang:1.22.2-alpine AS base

WORKDIR /app

RUN apk add --no-cache git bash curl

COPY go.mod go.sum ./
RUN go mod download

COPY . .

FROM base AS dev

RUN git clone https://github.com/cosmtrek/air.git /tmp/air && \
    cd /tmp/air && \
    go build -o /usr/local/bin/air .

EXPOSE 8080

CMD ["air"]

FROM base AS prod-builder

RUN go build -o /app/main .

FROM alpine:latest AS prod

WORKDIR /root/

COPY --from=prod-builder /app/main .

EXPOSE 8080

CMD ["./main"]