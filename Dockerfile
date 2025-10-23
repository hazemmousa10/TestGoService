# syntax=docker/dockerfile:1

# Build stage
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Copy go.mod
COPY /service/go.mod ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY /service ./

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -o /service

# Final stage
FROM alpine:latest

WORKDIR /root/

COPY --from=builder /service .

EXPOSE 8080

CMD ["./service"]