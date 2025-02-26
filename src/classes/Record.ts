// the visual representation and the data retrieved from an endpoint

// Records are visually represented as "nodes" or shapes on the canvas with rays drawn to related records

// should implement a mouseover behavior that displays a dialogue box that displays the record's fields

import * as PixiJs from "pixi.js";
import { Actor } from "./Actor";

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
  accountId: string; // Relationship field (to Account object)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
}

// interface Opportunity extends mockRecord {

// }

// export unneeded here?
export interface RecordActor extends MockRecord, Actor {
    sprite?: PixiJs.Sprite;
    shape?: any; // if I decide to make the accounts circles, squares, etc
    // relationship?: RecordRelationship; // Don't know how to implement the relationship drawing yet
}
