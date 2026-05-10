# 🔒 Security Report

**Date:** 2026-05-10 | **Stack:** Unknown / Unknown

## Summary

Critical security posture with 6 high-severity vulnerabilities exposing database and cache services without authentication. Hardcoded connection strings in config files and services bound to all network interfaces (0.0.0.0) create significant attack surface. Immediate remediation required for Redis, MongoDB, and Weaviate authentication before production deployment.

## Severity Breakdown

| Severity | Total | Auto-Fixed |
|----------|-------|------------|
| 🟠 high | 6 | 6 |
| 🟡 medium | 10 | 8 |
| 🟢 low | 4 | 2 |

## Findings

### 🟠 High

**1. Hardcoded Redis Connection String** — `config/default.json:18`
```
"uri": "redis://localhost:6379"
```
Redis connection URI is hardcoded. In production, this may contain credentials that should not be in configuration files. ✅ Auto-fixed

**2. Hardcoded MongoDB Connection String** — `config/default.json:21`
```
"uri": "mongodb://localhost:27017?replicaSet=rs0&directConnection=true"
```
MongoDB connection URI is hardcoded. Production databases typically require authentication credentials that should not be stored in config files. ✅ Auto-fixed

**3. Insecure HTTP Protocol for Webhook Callback URL** — `config/default.json:30`
```
"baseUrl": "http://localhost:3000/plugins/webhooks/callback/"
```
Webhook callback URL uses insecure HTTP protocol instead of HTTPS, allowing potential man-in-the-middle attacks on webhook data. ✅ Auto-fixed

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

**6. Weaviate Anonymous Access Enabled** — `docker-compose.yml:46`
```
AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED=true
```
Weaviate is configured to allow anonymous access, bypassing any authentication requirements. ✅ Auto-fixed

### 🟡 Medium

**1. File truncated - cannot verify if security middleware (helmet, rate limiting) is configured** — `src/main.ts`
File truncated - cannot verify if security middleware (helmet, rate limiting) is configured ⚠️ Manual review

**2. Cannot verify CORS configuration** — `src/main.ts`
Cannot verify CORS configuration ⚠️ Manual review

**3. Swagger API Documentation Exposed in Production** — `config/default.json:6`
```
"active": "1"
```
Swagger API documentation is enabled in production environment, exposing API structure and endpoints to potential attackers. ✅ Auto-fixed

**4. Server Binding to All Network Interfaces** — `config/default.json:12`
```
"hostname": "0.0.0.0"
```
Server is configured to listen on all network interfaces (0.0.0.0), potentially exposing the service to unintended networks. ✅ Auto-fixed

**5. Hardcoded Temporal Service Address** — `config/default.json:24`
```
"address": "localhost:7233"
```
Temporal service address is hardcoded, which may expose internal infrastructure details and prevent secure configuration in different environments. ✅ Auto-fixed

**6. Weaviate Using Insecure HTTP Scheme** — `docker-compose.yml:54`
```
command: --host 0.0.0.0 --port 8080 --scheme http
```
Weaviate is configured to use HTTP instead of HTTPS, transmitting data in plaintext. ✅ Auto-fixed

**7. Redis Image Using Latest Tag** — `docker-compose.yml:19`
```
image: redis
```
Redis image is using implicit 'latest' tag which can lead to unpredictable deployments and potential security vulnerabilities from untested versions. ✅ Auto-fixed

**8. Weaviate Ports Exposed to All Interfaces** — `docker-compose.yml:42`
```
- 8080:8080
```
Weaviate HTTP and gRPC ports are exposed to all network interfaces. ✅ Auto-fixed

**9. Temporal Ports Exposed to All Interfaces** — `docker-compose.yml:28`
```
- 7233:7233
```
Temporal server, UI, and metrics ports are exposed to all network interfaces without authentication. ✅ Auto-fixed

**10. File Server Exposed Without Access Control** — `docker-compose.yml:70`
```
- '5555:5555'
```
Python HTTP file server is exposed without any access control, serving files to anyone. ✅ Auto-fixed

### 🟢 Low

**1. Incomplete file - cannot fully assess dependencies** — `package.json`
Incomplete file - cannot fully assess dependencies ⚠️ Manual review

**2. References to external AI services - ensure API keys are not hardcoded elsewhere** — `src/unbody.settings.ts`
References to external AI services - ensure API keys are not hardcoded elsewhere ⚠️ Manual review

**3. Hardcoded File Storage Path** — `config/default.json:33`
```
"rootPath": "./devenv/storage/plugins"
```
File storage path is hardcoded with a development-specific path, which may not be appropriate for production and could expose directory structure. ✅ Auto-fixed

**4. img2vec-neural Port Exposed to All Interfaces** — `docker-compose.yml:64`
```
- 3456:8080
```
The img2vec-neural service port is exposed to all network interfaces. ✅ Auto-fixed

## Action Plan

*Generated by Agnixa Recon 2.0 Brain — 2026-05-10T12:40:41.757Z*
