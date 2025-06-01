import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "@/lib/dynamo";
import { type UserRegistrationInput } from "@/types/auth";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = "Inverter-db";

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
