// Connection encapsulates retrieval from a database endpoint, which is mocked in this demo

// The connection will need to provide Record objects to the scene graph in Scene

// We'll use Zod here to "validate" the data as it comes in

// To simulate more async, maybe provide the records to the scene graph one by one instead of a single payload?

import { z } from "zod";
import { EndpointMock } from "./EndpointMock";

// valid schemas
const accountSchema = z.object({
  Id: z.string(),
  name: z.string(),
  createdDate: z.string(),
  type: z.string(),
  industry: z.string(),
  numberOfEmployees: z.number(),
  annualRevenue: z.number(),
  website: z.string(),
  phone: z.string(),
});

const contactSchema = z.object({
  Id: z.string(),
  name: z.string(),
  createdDate: z.string(),
  type: z.string(),
  accountId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  title: z.string(),
});

const mockRecordSchema = z.discriminatedUnion("type", [
  accountSchema.extend({ type: z.literal("Account") }),
  contactSchema.extend({ type: z.literal("Contact") }),
]);

// Fake connection logic:
interface ConnectionStrategy {
  getRecords(): Promise<string>;
}
// provide a class that could be overridden via dependency injection for a "real" connection, if I want
class MockConnection implements ConnectionStrategy {
  constructor() {}

  async getRecords(): Promise<string> {
    const mock: EndpointMock = new EndpointMock();
    try {
      const rawData = await mock.respondWithData();
      return rawData;
    } catch {
      throw new Error(
        "Couldn't retrieve records from mock endpoint... major skill issue"
      );
    }
  }
}

export class Connection {
  private connection = new MockConnection();
  private records: any[] = [];

  constructor() {}

  async fetchRecords(): Promise<any[]> {
    try {
      const response = await this.connection.getRecords();
      const parsedData: any[] = JSON.parse(response);
      this.processRecords(parsedData);
    } catch {
      throw new Error("Bad stuff happened: JSON parse failed");
    }
    return this.records;
  }

  private processRecords(rawRecords: any[]): void {
    rawRecords.forEach((record: any) => {
      const validationResult = mockRecordSchema.safeParse(record);
      if (!validationResult.success) {
        console.warn("Validation failed: ", validationResult.error);
        return;
      }

      // already validated, safe to push now
      this.records.push(validationResult.data);
    });
  }
}
