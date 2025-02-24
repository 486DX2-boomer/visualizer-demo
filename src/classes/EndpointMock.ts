// Provide fake data to a connection as raw JSON

import * as Record from "./Record";

export class EndpointMock {
  private internalData: Record.MockRecord[] = [];

  constructor() {
    this.internalData = this.makeMockData();
  }

  private makeMockData(): Record.MockRecord[] {
    const mockData: Record.MockRecord[] = [];
    mockData.push(...this.fakeAccounts);
    mockData.push(...this.fakeContacts);
    return mockData;
  }

  private fakeAccounts: Record.Account[] = [
    {
      Id: "ACC-10001",
      name: "Global Concepts Ltd",
      type: "Account",
      createdDate: "2022-03-15T14:30:45.123Z",
      industry: "Technology",
      numberOfEmployees: 1250,
      annualRevenue: 25000000,
      website: "https://www.globalconcepts.com",
      phone: "(415) 555-1234",
    },
    {
      Id: "ACC-10002",
      name: "Primary and Secondary Healthcare",
      type: "Account",
      createdDate: "2021-11-08T09:15:22.456Z",
      industry: "Healthcare",
      numberOfEmployees: 3500,
      annualRevenue: 75000000,
      website: "https://www.pshealth.com",
      phone: "(310) 555-2345",
    },
    {
      Id: "ACC-10003",
      name: "RF Goldman Holdings",
      type: "Account",
      createdDate: "2022-01-22T11:45:10.789Z",
      industry: "Financial Services",
      numberOfEmployees: 850,
      annualRevenue: 15000000,
      website: "https://www.rfgoldman.com",
      phone: "(212) 555-3456",
    },
    {
      Id: "ACC-10004",
      name: "Amalgamated Fluorodynamics",
      type: "Account",
      createdDate: "2021-08-17T16:20:30.321Z",
      industry: "Manufacturing",
      numberOfEmployees: 2200,
      annualRevenue: 45000000,
      website: "https://www.amalgamatedfluoro.com",
      phone: "(713) 555-4567",
    },
    {
      Id: "ACC-10005",
      name: "Lineamatic",
      type: "Account",
      createdDate: "2022-05-03T10:05:15.654Z",
      industry: "Retail",
      numberOfEmployees: 750,
      annualRevenue: 12000000,
      website: "https://www.lineamatic.com",
      phone: "(312) 555-5678",
    },
    {
      Id: "ACC-10006",
      name: "NES",
      type: "Account",
      createdDate: "2021-10-11T13:40:55.987Z",
      industry: "Education",
      numberOfEmployees: 580,
      annualRevenue: 8500000,
      website: "https://www.nes.com",
      phone: "(617) 555-6789",
    },
    {
      Id: "ACC-10007",
      name: "Petrolair",
      type: "Account",
      createdDate: "2022-02-28T15:55:25.741Z",
      industry: "Energy",
      numberOfEmployees: 1800,
      annualRevenue: 65000000,
      website: "https://www.petrolair.com",
      phone: "(713) 555-7890",
    },
  ];

  private fakeContacts: Record.Contact[] = [
    {
      Id: "CON-10001",
      accountId: "ACC-10001",
      type: "Contact",
      name: "Michael Williams",
      firstName: "Michael",
      lastName: "Williams",
      email: "michael.williams@globalconcepts.com",
      createdDate: "2022-03-20T09:10:25.123Z",
      phone: "(415) 555-1001",
      title: "CTO",
    },
    {
      Id: "CON-10002",
      accountId: "ACC-10001",
      type: "Contact",
      name: "Jennifer Davis",
      firstName: "Jennifer",
      lastName: "Davis",
      email: "jennifer.davis@globalconcepts.com",
      createdDate: "2022-03-25T14:30:45.456Z",
      phone: "(415) 555-1002",
      title: "VP of Marketing",
    },

    {
      Id: "CON-10003",
      accountId: "ACC-10002",
      type: "Contact",
      name: "Robert Smith",
      firstName: "Robert",
      lastName: "Smith",
      email: "robert.smith@pshealth.com",
      createdDate: "2021-11-15T10:20:30.789Z",
      phone: "(310) 555-2001",
      title: "CEO",
    },
    {
      Id: "CON-10004",
      accountId: "ACC-10002",
      type: "Contact",
      name: "Susan Johnson",
      firstName: "Susan",
      lastName: "Johnson",
      email: "susan.johnson@pshealth.com",
      createdDate: "2021-11-18T11:25:35.321Z",
      phone: "(310) 555-2002",
      title: "Director",
    },

    {
      Id: "CON-10005",
      accountId: "ACC-10003",
      type: "Contact",
      name: "David Martinez",
      firstName: "David",
      lastName: "Martinez",
      email: "david.martinez@rfgoldman.com",
      createdDate: "2022-01-25T13:15:40.654Z",
      phone: "(212) 555-3001",
      title: "CFO",
    },

    {
      Id: "CON-10006",
      accountId: "ACC-10004",
      type: "Contact",
      name: "Elizabeth Brown",
      firstName: "Elizabeth",
      lastName: "Brown",
      email: "elizabeth.brown@amalgamatedfluoro.com",
      createdDate: "2021-08-22T15:30:45.987Z",
      phone: "(713) 555-4001",
      title: "VP of Operations",
    },
    {
      Id: "CON-10007",
      accountId: "ACC-10004",
      type: "Contact",
      name: "William Garcia",
      firstName: "William",
      lastName: "Garcia",
      email: "william.garcia@amalgamatedfluoro.com",
      createdDate: "2021-08-25T16:40:50.741Z",
      phone: "(713) 555-4002",
      title: "Manager",
    },

    {
      Id: "CON-10008",
      accountId: "ACC-10005",
      type: "Contact",
      name: "Sarah Wilson",
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah.wilson@lineamatic.com",
      createdDate: "2022-05-10T09:45:15.852Z",
      phone: "(312) 555-5001",
      title: "Director of Sales",
    },

    {
      Id: "CON-10009",
      accountId: "ACC-10006",
      type: "Contact",
      name: "Thomas Rodriguez",
      firstName: "Thomas",
      lastName: "Rodriguez",
      email: "thomas.rodriguez@nes.com",
      createdDate: "2021-10-18T11:20:35.963Z",
      phone: "(617) 555-6001",
      title: "CEO",
    },

    {
      Id: "CON-10010",
      accountId: "ACC-10007",
      type: "Contact",
      name: "Nancy Taylor",
      firstName: "Nancy",
      lastName: "Taylor",
      email: "nancy.taylor@petrolair.com",
      createdDate: "2022-03-05T14:35:25.123Z",
      phone: "(713) 555-7001",
      title: "VP of Sales",
    },
    {
      Id: "CON-10011",
      accountId: "ACC-10007",
      type: "Contact",
      name: "Charles Anderson",
      firstName: "Charles",
      lastName: "Anderson",
      email: "charles.anderson@petrolair.com",
      createdDate: "2022-03-08T15:45:30.456Z",
      phone: "(713) 555-7002",
      title: "CTO",
    },
  ];

  async respondWithData(): Promise<string> {
    try {
      // Simulated network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return JSON.stringify(this.internalData);
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  }
}
