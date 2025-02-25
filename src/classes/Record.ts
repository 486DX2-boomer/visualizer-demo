// Record encapsulates the visual representation and the data retrieved from an endpoint

// Records are visually represented as "nodes" or shapes on the canvas with rays drawn to related records

// Records should implement a mouseover behavior that displays a dialogue box that displays the record's fields

import * as PixiJs from "pixi.js";

export interface MockRecord {
  Id: string;
  name: string;
  createdDate: string;
  type: string; // for discriminating if necessary
}

// interface RecordRelationship {
//   relatedRecordId: string;
//   relatedObjectType: string;
//   fieldName: string;
//   relationshipType: RelationshipType;

//   // Optional metadata for visualization
//   visualMetadata?: {
//     lineStyle?: "solid" | "dashed" | "dotted";
//     lineColor?: string;
//     lineThickness?: number;
//     label?: string;
//   };
// }

export interface Account extends MockRecord {
  industry: string;
  numberOfEmployees: number;
  annualRevenue: number;
  website: string;
  phone: string;
}

export interface Contact extends MockRecord {
  accountId: string; // Relationship to Account
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
}

// interface Opportunity extends mockRecord {

// }

// export unneeded here?
export interface DrawableRecord extends MockRecord {
    behaviors: any[]; // Array of functions
    onDraw: () => {};
    onUpdate: () => {};
    sprite?: PixiJs.Sprite;
    shape?: any; // if I decide to make the accounts circles, squares, etc
}
