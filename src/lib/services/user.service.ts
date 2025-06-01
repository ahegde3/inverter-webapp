import { PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "@/lib/dynamo";
import { type UserRegistrationInput } from "@/types/auth";
import { v4 as uuidv4 } from "uuid";
import { User, userSchema } from "@/lib/schema";

const TABLE_NAME = "Inverter-db";
// Encryption key - should match the frontend key
const ENCRYPTION_KEY = process.env.SECRET_KEY || "123456";

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
      PK: `USER#${userData.emailId}`,
      SK: "PROFILE",
      userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      emailId: userData.emailId,
      phoneNo: userData.phoneNo,
      address: userData.address,
      password: userData.password,
      role: userData.role,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    // console.log("user", user);
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
    TableName: TABLE_NAME,
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

export const getUsersByRole = async (roleName: string): Promise<User[]> => {
  if (!roleName) throw new Error("Invalid params");
  try {
    const params = {
      TableName: "Inverter-db",
      FilterExpression: "begins_with(PK, :pk) AND SK = :sk AND #role = :role",
      ExpressionAttributeValues: {
        ":pk": "USER#",
        ":sk": "PROFILE",
        ":role": roleName,
      },
      ExpressionAttributeNames: {
        "#role": "role",
      },
    };
    const data = await ddb.send(new ScanCommand(params));
    console.log(data);

    if (!data.Items) return [];

    // Validate and transform each user
    const users = data.Items.map((item) => {
      const userResult = userSchema.safeParse(item);
      if (!userResult.success) {
        console.error(
          "Invalid user data from DynamoDB:",
          !userResult.success && userResult.error
        );
        return null;
      }
      return userResult.data;
    }).filter((user): user is User => user !== null);

    return users;
  } catch (error) {
    console.error("Failed while fetching users:", error);
    throw new UserServiceError("Failed to fetch users");
  }
};

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
