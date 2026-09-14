# Mark1 MCP Server

A simple MCP server for storing and retrieving users in MongoDB.

## Requirements

- Node.js
- MongoDB

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
DB_URI=your_mongodb_connection_string
```

## Run

```bash
npm start
```

The server runs over stdio and can be connected to by an MCP client.

## Tools

- `get_data` retrieves all users.
- `create_user` creates a user with a name and nonnegative integer age.
