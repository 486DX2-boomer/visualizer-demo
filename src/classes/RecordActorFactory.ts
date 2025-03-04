import { ActorCollection } from "./ActorCollection";
import { ContactActor } from "../actors/ContactActor";
import * as PixiJs from "pixi.js";
import { AccountActor } from "../actors/AccountActor";
import { RelationshipLine } from "../actors/RelationshipLine";
import { Contact } from "./Record";

// Responsible for placing record actors into the scene

export class RecordActorFactory {
  private app: PixiJs.Application;
  private actors: ActorCollection;
  private screenWidth: number;
  private screenHeight: number;
  private padding: number = 50;

  private globalMousePositionRef: { x: number; y: number };
  
  private accountActorMap = new Map();
  private contactActorMap = new Map();

  constructor(
    appReference: PixiJs.Application,
    actorCollection: ActorCollection,
    padding: number = 50,
    mousePos: { x: number; y: number }
  ) {
    this.app = appReference;
    this.actors = actorCollection;
    this.screenWidth = this.app.screen.width;
    this.screenHeight = this.app.screen.height;
    this.padding = padding;
    this.globalMousePositionRef = mousePos;
  }

  private createAccountPositions(count: number): Array<{ x: number; y: number }> {
    const positions = [];
    // Place accounts firmly in the left third of the screen
    const centerX = this.screenWidth * 0.25;
    const centerY = this.screenHeight * 0.5;
    const verticalSpread = this.screenHeight * 0.7;
    const horizontalSpread = this.screenWidth * 0.2;
    const minDistance = 70;
    
    let attempts = 0;
    const maxAttempts = count * 20;
    
    while (positions.length < count && attempts < maxAttempts) {
      attempts++;
      
      // Vertical line distribution with some horizontal variance
      const relativePos = positions.length / Math.max(count - 1, 1);
      // Map from 0-1 to -0.5 to 0.5 for y positioning
      const yOffset = (relativePos - 0.5) * verticalSpread;
      
      // Add some horizontal variance but keep accounts to the left
      let x = centerX + (Math.random() - 0.3) * horizontalSpread;
      let y = centerY + yOffset;
      
      // Add small random jitter to prevent perfect alignment
      y += (Math.random() - 0.5) * 30;
      
      // Keep in bounds
      x = Math.max(this.padding, Math.min(this.screenWidth * 0.4, x));
      y = Math.max(this.padding, Math.min(this.screenHeight - this.padding, y));
      
      // Check for collisions
      let tooClose = false;
      for (const pos of positions) {
        const dx = pos.x - x;
        const dy = pos.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < minDistance) {
          tooClose = true;
          break;
        }
      }
      
      if (!tooClose) {
        positions.push({ x, y });
      }
    }
    
    // Fall back to a grid if needed
    if (positions.length < count) {
      const rows = Math.ceil(Math.sqrt(count - positions.length));
      const cols = Math.ceil((count - positions.length) / rows);
      
      const stepX = horizontalSpread / Math.max(cols, 1);
      const stepY = verticalSpread / Math.max(rows, 1);
      
      for (let i = positions.length; i < count; i++) {
        const idx = i - positions.length;
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        
        // Center the grid in our target area
        const x = centerX - horizontalSpread/2 + col * stepX + stepX/2;
        const y = centerY - verticalSpread/2 + row * stepY + stepY/2;
        
        positions.push({ x, y });
      }
    }
    
    return positions;
  }

  private createContactPositions(contacts: any[]): Array<{ x: number; y: number, contactId: string }> {
    const positions = [];
    const minDistance = 100;
    
    // Group contacts by their account ID
    const contactsByAccount = new Map();
    for (const contact of contacts) {
      const accountId = contact.accountId;
      if (!contactsByAccount.has(accountId)) {
        contactsByAccount.set(accountId, []);
      }
      contactsByAccount.get(accountId).push(contact);
    }
    
    // Get account positions
    const accountPositions = new Map();
    for (const [id, accountActor] of this.accountActorMap.entries()) {
      accountPositions.set(
        id, 
        { x: accountActor.container.position.x, y: accountActor.container.position.y }
      );
    }
    
    // Track existing positions for collision detection
    const allPositions = Array.from(accountPositions.values());
    
    // Place contacts for each account
    for (const [accountId, accountContacts] of contactsByAccount.entries()) {
      if (!accountPositions.has(accountId)) {
        // In a real scenario, we would need fallback logic for orphaned contacts
        console.warn(`Contact has no related account: ${accountId}`);
        continue;
      }
      
      const accountPos = accountPositions.get(accountId);
      const contactCount = accountContacts.length;
      
      // Position contacts to the right of their accounts in a column
      if (contactCount > 0) {
        // right-side positioning with more horizontal spread
        const baseX = Math.max(accountPos.x + 120, this.screenWidth * 0.6);
        
        for (let i = 0; i < contactCount; i++) {
          const contact = accountContacts[i];
          
          // Distribute evenly vertically
          const yOffset = ((i - (contactCount-1)/2) / Math.max(contactCount, 1)) * 120;
          
          let placed = false;
          let attempts = 0;
          let x, y;
          
          while (!placed && attempts < 10) {
            attempts++;
            
            // Position contacts to the right
            x = baseX + (Math.random() * 160);
            y = accountPos.y + yOffset + (Math.random() - 0.5) * 40;
            
            // Keep in bounds
            x = Math.max(this.screenWidth * 0.5, Math.min(this.screenWidth - this.padding, x));
            y = Math.max(this.padding, Math.min(this.screenHeight - this.padding, y));
            
            // Check for collisions
            let tooClose = false;
            for (const pos of allPositions) {
              const dx = pos.x - x;
              const dy = pos.y - y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < minDistance) {
                tooClose = true;
                break;
              }
            }
            
            if (!tooClose) {
              placed = true;
            }
          }
          
          const position = { x, y, contactId: contact.Id };
          positions.push(position);
          allPositions.push({ x, y });
        }
      }
    }
    
    return positions;
  }
  
  // In a real implementation, we would need a method to handle orphaned records

  private createAccountActors(accounts: any[]): void {
    if (accounts.length === 0) return;
    
    const accountPositions = this.createAccountPositions(accounts.length);
    
    accounts.forEach((account, i) => {
      const actor = new AccountActor(this.app, account, this.globalMousePositionRef);
      this.actors.addActor(actor as any);
      actor.container!.position.set(accountPositions[i].x, accountPositions[i].y);
      
      this.accountActorMap.set(account.Id, actor);
    });
  }

  private createContactActors(contacts: any[]): void {
    if (contacts.length === 0) return;
    
    const contactPositions = this.createContactPositions(contacts);
    
    contacts.forEach((contact) => {
      const actor = new ContactActor(this.app, contact, this.globalMousePositionRef);
      this.actors.addActor(actor as any);
      
      const position = contactPositions.find(pos => pos.contactId === contact.Id);
      if (position) {
        actor.container!.position.set(position.x, position.y);
      }
      
      this.contactActorMap.set(contact.Id, actor);
    });
  }

  private createRelationships(): void {
    for (const [contactId, contactActor] of this.contactActorMap.entries()) {
      const contactData = contactActor.recordData as Contact;
      const accountId = contactData.accountId;
      
      if (this.accountActorMap.has(accountId)) {
        const accountActor = this.accountActorMap.get(accountId);
        const line = new RelationshipLine(this.app, contactActor, accountActor);
        this.actors.addActor(line);
      }
    }
  }

  createRecordActors(response: any[]): void {
    if (!response || response.length === 0) {
      console.warn("No records to create actors from");
      return;
    }

    // Split records by type
    const accounts = [];
    const contacts = [];

    for (const record of response) {
      if (record.type === "Account") {
        accounts.push(record);
      } else if (record.type === "Contact") {
        contacts.push(record);
      }
    }

    this.createAccountActors(accounts);
    this.createContactActors(contacts);
    this.createRelationships();
    
    console.log(`Created ${accounts.length} accounts, ${contacts.length} contacts`);
  }
}