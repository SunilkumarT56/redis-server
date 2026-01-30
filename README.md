<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="Redis Logo" width="120" />
</div>

# Redis-Lite: A Redis-Inspired In-Memory Data Store

## 📌 Project Overview

**Redis-Lite** is a lightweight, high-performance in-memory key-value data store built from scratch in TypeScript. This project serves as a deep dive into systems engineering, implementing the core architecture of Redis to understand the underlying principles of database internals, TCP networking, and protocol design.

> **Note:** This is an educational project designed to demonstrate backend systems concepts. It is **not** intended as a production-grade replacement for Redis.

---

## 🏗 Architecture

The system follows a classic **Client-Server** architecture, communicating over **TCP** using a custom implementation of the **RESP (REdis Serialization Protocol)**.

### Core Components

1.  **TCP Server**: Built using Node.js `net` module to handle concurrent client connections.
2.  **RESP Parser**: A custom-built parser that processes incoming byte streams, handles protocol framing, and serializes responses.
3.  **Command Execution Engine**: Parses parsed commands and routes them to the appropriate handler.
4.  **In-Memory Store**: Uses a high-performance hash map structure to store key-value pairs with O(1) access time.
5.  **TTL Manager**: Handles key expiration using a hybrid strategy (Lazy + Active expiration).

---

## ⚡ Supported Commands

The server supports a subset of standard Redis commands:

| Command    | Syntax                  | Description                                                           |
| :--------- | :---------------------- | :-------------------------------------------------------------------- |
| **PING**   | `PING [message]`        | Returns `PONG` or the optional message. Used for health checks.       |
| **ECHO**   | `ECHO message`          | Returns the given string.                                             |
| **SET**    | `SET key value [PX ms]` | Sets a key-value pair, optionally with an expiration in milliseconds. |
| **GET**    | `GET key`               | Retrieves the value of a key. Returns `nil` if not found.             |
| **DEL**    | `DEL key`               | Removes the specified key.                                            |
| **EXISTS** | `EXISTS key`            | Checks if a key exists.                                               |
| **INCR**   | `INCR key`              | Increments the integer value of a key by one.                         |
| **DECR**   | `DECR key`              | Decrements the integer value of a key by one.                         |

---

## 🧠 Key Engineering Concepts

### 1. The RESP Protocol

Implementing the **REdis Serialization Protocol (RESP)** was a core part of this project. The server manually parses raw TCP buffers to handle data types like:

- **Simple Strings** (`+OK\r\n`)
- **Errors** (`-Error message\r\n`)
- **Integers** (`:1000\r\n`)
- **Bulk Strings** (`$6\r\nfoobar\r\n`)
- **Arrays** (`*2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n`)

### 2. TTL & Expiration Strategy

To manage memory efficiently, keys can have a "Time To Live" (TTL). The expiration strategy mimics Redis:

- **Lazy Expiration**: When a key is accessed (e.g., via `GET`), the server checks if it has expired. If so, it is deleted immediately and `nil` is returned.
- **Active Expiration**: A background interval randomly samples keys with an expiry set and removes those that have expired, ensuring memory is freed even for unaccessed keys.

### 3. Persistence (In-Memory vs Disk)

The data store is primarily **In-Memory** for speed.

- **Current State**: Data is volatile and lost on restart.
- **Design Pattern**: The architecture supports a 'Save-on-Shutdown' mechanism (similar to Redis RDB) where the in-memory map acts as a snapshot that can be serialized to JSON/Binary on disk.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v10+) or pnpm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/redis-lite.git
cd redis-lite
npm install
```

### Running the Server

Start the development server:

```bash
npm run dev
# Server listening on 127.0.0.1:6379
```

### Connecting with Redis CLI

You can use the official `redis-cli` (or any Redis client) to connect to this server:

```bash
redis-cli -p 6379
127.0.0.1:6379> PING
PONG
127.0.0.1:6379> SET name "Senior Engineer"
OK
127.0.0.1:6379> GET name
"Senior Engineer"
```

---

## ⚠️ Limitations & Future Roadmap

Since this is a learning implementation, there are conscious trade-offs:

- **Single-Threaded**: Like Redis, this uses a single main event loop. However, CPU-intensive commands can block processing.
- **Persistence**: Currently volatile-only. RDB (Snapshotting) and AOF (Append Only File) persistence are planned for v2.
- **No Clustering**: Supports a single node only.
- **Data Types**: Currently supports Strings and Integers. Lists, Sets, and Hashes are widely planned.

---

## 🎓 Learnings

Building this project reinforced several critical systems engineering concepts:

- **Socket Programming**: managing raw TCP connections and buffer handling.
- **Protocol Design**: dealing with framing, serialization, and deserialization.
- **Memory Management**: understanding references, garbage collection, and expiration algorithms.
- **Concurrent Clients**: handling multiple connections asynchronously without threads.

---

_Built with ❤️ by Sunil Kumar_
