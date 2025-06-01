import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "@/lib/dynamo";
import { type UserRegistrationInput } from "@/types/auth";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = "Inverter-db";
// Encryption key - should match the frontend key
const ENCRYPTION_KEY = process.env.SECRET_KEY || "123456";

//Simple XOR encryption function

export class UserServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserServiceError";
  }
}

export async function createUser(userData: UserRegistrationInput) {
  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const userId = uuidv4();

    const user = {
      PK: `USER#${userData.email}`,
      SK: "PROFILE",
      userId,
      firstName: userData.first_name,
      lastName: userData.last_name,
      email: userData.email,
      address: userData.address,
      role: userData.role,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await ddb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: user,
        ConditionExpression: "attribute_not_exists(PK)",
      })
    );

    // Return the user without the PK/SK for API response
    const userResponse = Object.fromEntries(
      Object.entries(user).filter(([key]) => !["PK", "SK"].includes(key))
    );
    return userResponse;
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "ConditionalCheckFailedException"
    ) {
      throw new UserServiceError("Email already exists");
    }

    throw new UserServiceError("Failed to create user");
  }
}

export async function findUserByEmail({
  email,
}: {
  email: string;
}): Promise<User | null> {
  if (!email) return null;

  const params = {
    TableName: "Inverter-db",
    KeyConditionExpression: "PK = :pk AND SK = :sk",
    ExpressionAttributeValues: {
      ":pk": `USER#${email}`,
      ":sk": "PROFILE",
    },
    Limit: 1,
  };

  const result = await ddb.send(new QueryCommand(params));

  if (!result.Items || result.Items.length === 0) return null;

  // Validate the DynamoDB response against our schema
  const userResult = userSchema.safeParse(result.Items[0]);
  if (!userResult.success) {
    console.error("Invalid user data from DynamoDB:", userResult.error);
    return null;
  }

  return userResult.data;
}

export const encryptPassword = (password: string): string => {
  try {
    let encrypted = "";
    for (let i = 0; i < password.length; i++) {
      const passwordChar = password.charCodeAt(i);
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      encrypted += String.fromCharCode(passwordChar ^ keyChar);
    }
    // Base64 encode the encrypted string
    return btoa(encrypted);
  } catch (error) {
    console.error("Error encrypting password:", error);
    throw new Error("Password encryption failed");
  }
};
