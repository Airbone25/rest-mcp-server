import 'dotenv/config'
import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import mongoose from "mongoose";

const server = new McpServer({
    name: "rest-server",
    version: "1.0.0",
})

//Database Connection
mongoose.connect(process.env.DB_URI)
const db = mongoose.connection
db.on('error', (e) => console.error(e.message))
db.once('open', () => console.log("Database is connected successfully"))

//User Schema
const userSchema = new mongoose.Schema({
    name: String,
    age: Number
})
const User = mongoose.model("User",userSchema)

//functions
async function getData() {
    try {
        return await User.find()
    } catch (error) {
        return { "message": "Internal Server Error" }
    }
}

async function createData(name, age) {
    try {
        const newData = new User({
            name,
            age
        })
        const saveData = await newData.save()
        return saveData
    } catch (error) {
        return { "message": "Internal Server Error" }
    }
}

//tools
server.registerTool(
    "get_data",
    {
        description: "Get user data from the database.",
        inputSchema: {},
    },
    async () => {
        const userData = await getData()
        if (!userData) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Failed to retrieve user data",
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(userData)
                }
            ]
        }
    }
)

server.registerTool(
    "create_data",
    {
        description: "Create user data in the database.",
        inputSchema: z.object({
            name: z.string(),
            age: z.number()
        }),
    },
    async ({name,age}) => {
        const userData = await createData(name,age)
        if (!userData) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Failed to add user data",
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: "Created User Data!"
                }
            ]
        }
    }
)

server.registerTool(
    "create_user",
    {
        description: "Create a user in the database.",
        inputSchema: z.object({
            name: z.string().min(1),
            age: z.number().int().nonnegative(),
        }),
    },
    async ({ name, age }) => {
        const userData = await createData(name, age)
        return {
            content: [
                {
                    type: "text",
                    text: "User Created Successfully!",
                },
            ],
        }
    }
)

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Rest MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});