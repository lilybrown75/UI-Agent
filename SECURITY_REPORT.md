# 🔒 Security Report

**Date:** 2026-05-10 | **Stack:** Unknown / Unknown

## Summary

Critical security posture with 7 high-severity vulnerabilities exposing databases and services without authentication. Multiple services (MongoDB, Redis, Weaviate, file server) are bound to all interfaces with no access controls, creating immediate exploitation risk. Hardcoded connection strings and insecure HTTP protocols compound the exposure.

## Severity Breakdown

| Severity | Total | Auto-Fixed |
|----------|-------|------------|
| 🟠 high | 7 | 7 |
| 🟡 medium | 10 | 9 |
| 🟢 low | 2 | 1 |

## Findings

### 🟠 High

**1. Hardcoded Redis Connection String** — `config/default.json:16`
```
"uri": "redis://localhost:6379"
```
Redis connection string is hardcoded. In production, this may contain credentials that should not be in configuration files. ✅ Auto-fixed

**2. Hardcoded MongoDB Connection String** — `config/default.json:19`
```
"uri": "mongodb://localhost:27017?replicaSet=rs0&directConnection=true"
```
MongoDB connection string is hardcoded. Production databases typically require authentication credentials. ✅ Auto-fixed

**3. Insecure HTTP Webhook URL** — `config/default.json:27`
```
"baseUrl": "http://localhost:3000/plugins/webhooks/callback/"
```
Webhook callback URL uses insecure HTTP protocol instead of HTTPS, allowing man-in-the-middle attacks. ✅ Auto-fixed

**4. MongoDB Port Exposed to All Interfaces** — `docker-compose.yml:14`
```
- '27017:27017'
```
MongoDB port is exposed to all network interfaces (0.0.0.0), making it accessible from outside the host machine without authentication. ✅ Auto-fixed

**5. Redis Port Exposed Without Authentication** — `docker-compose.yml:22`
```
- '6379:6379'
```
Redis port is exposed to all network interfaces without any authentication configured, allowing unauthorized access. ✅ Auto-fixed

**6. Weaviate Anonymous Access Enabled** — `docker-compose.yml:45`
```
- AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED=true
```
Weaviate is configured to allow anonymous access, meaning anyone can query and modify the vector database without authentication. ✅ Auto-fixed

**7. File Server Exposed Without Access Control** — `docker-compose.yml:68`
```
- '5555:5555'
```
Python HTTP file server is exposed to all interfaces with no authentication, serving files from mounted directories. ✅ Auto-fixed

### 🟡 Medium

**1. Cannot fully assess - file truncated, should verify helmet/rate-limiting middleware is configured** — `src/main.ts`
Cannot fully assess - file truncated, should verify helmet/rate-limiting middleware is configured ⚠️ Manual review

**2. Swagger/API Documentation Exposed in Production** — `config/default.json:6`
```
"active": "1"
```
Swagger API documentation is enabled in production environment, exposing API structure and endpoints to potential attackers. ✅ Auto-fixed

**3. Server Binding to All Network Interfaces** — `config/default.json:11`
```
"hostname": "0.0.0.0"
```
Server is configured to bind to all network interfaces (0.0.0.0), potentially exposing the service to unintended networks. ✅ Auto-fixed

**4. Hardcoded Temporal Service Address** — `config/default.json:22`
```
"address": "localhost:7233"
```
Temporal service address is hardcoded, which may expose internal infrastructure details. ✅ Auto-fixed

**5. Hardcoded File Storage Path** — `config/default.json:30`
```
"rootPath": "./devenv/storage/plugins"
```
File storage path is hardcoded with a development-specific path, which may lead to path traversal issues or incorrect permissions in production. ✅ Auto-fixed

**6. Redis Using Unpinned 'latest' Image Tag** — `docker-compose.yml:19`
```
image: redis
```
Redis image has no version tag specified, defaulting to 'latest' which can lead to unexpected updates with potential vulnerabilities or breaking changes. ✅ Auto-fixed

**7. Weaviate Using Insecure HTTP Scheme** — `docker-compose.yml:53`
```
command: --host 0.0.0.0 --port 8080 --scheme http
```
Weaviate is configured to use HTTP instead of HTTPS, transmitting data in plaintext. ✅ Auto-fixed

**8. Weaviate Port Exposed to All Interfaces** — `docker-compose.yml:40`
```
- 8080:8080
```
Weaviate HTTP port is exposed to all network interfaces, making the vector database accessible from external networks. ✅ Auto-fixed

**9. Temporal Ports Exposed to All Interfaces** — `docker-compose.yml:27`
```
- 7233:7233
```
Temporal server, UI, and metrics ports are exposed to all network interfaces without authentication. ✅ Auto-fixed

**10. img2vec-neural Port Exposed to All Interfaces** — `docker-compose.yml:61`
```
- 3456:8080
```
The img2vec-neural ML service port is exposed to all network interfaces. ✅ Auto-fixed

### 🟢 Low

**1. References to AI service providers - ensure API keys are loaded from environment variables** — `src/unbody.settings.ts`
References to AI service providers - ensure API keys are loaded from environment variables ⚠️ Manual review

**2. Python Image Using Unpinned Minor Version** — `docker-compose.yml:65`
```
image: python:3.9-slim
```
Python image uses a minor version tag which can receive updates that may introduce vulnerabilities. ✅ Auto-fixed

## Action Plan

*Generated by Agnixa Recon 2.0 Brain — 2026-05-10T15:14:18.805Z*
