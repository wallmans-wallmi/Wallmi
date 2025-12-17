import { Client } from '@hubspot/api-client';

let hubspotClient: Client | null = null;

function getHubSpotClient(): Client | null {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  
  if (!token) {
    console.warn('HUBSPOT_PRIVATE_APP_TOKEN is not set. HubSpot features will not work.');
    return null;
  }
  
  if (!hubspotClient) {
    hubspotClient = new Client({ accessToken: token });
  }
  
  return hubspotClient;
}

export interface ContactData {
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
}

export interface DealData {
  dealName: string;
  contactId: string;
  fineType?: string;
  fineDateTime?: string;
  fineLocation?: string;
  fineAmount?: string;
  finePoints?: string;
  lawSection?: string;
  caseId: string;
  reportFileUrl?: string;
  extractedSummary?: string;
}

/**
 * Upsert a contact in HubSpot
 * Returns the HubSpot contact ID or null if failed
 */
export async function upsertHubSpotContact(data: ContactData): Promise<string | null> {
  const client = getHubSpotClient();
  if (!client) return null;

  try {
    // Split full name into first/last if provided
    let firstName = data.firstName;
    let lastName = data.lastName;
    
    if (data.fullName && !firstName && !lastName) {
      const parts = data.fullName.trim().split(/\s+/);
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }

    const properties: Record<string, string> = {};
    if (firstName) properties.firstname = firstName;
    if (lastName) properties.lastname = lastName;
    if (data.fullName && (!firstName || !lastName)) {
      // Store full name in a custom property if we can't split it
      properties.full_name = data.fullName;
    }
    if (data.phone) properties.phone = data.phone;
    if (data.email) properties.email = data.email;

    // Search for existing contact by email
    if (data.email) {
      try {
        const searchResponse = await client.crm.contacts.searchApi.doSearch({
          query: data.email,
          limit: 1,
          sorts: [{ propertyName: 'createdate', direction: 'DESCENDING' }],
          properties: ['id', 'email'],
        });

        if (searchResponse.results && searchResponse.results.length > 0) {
          const existingContactId = searchResponse.results[0].id;
          
          // Update existing contact
          await client.crm.contacts.basicApi.update(existingContactId, { properties });
          
          // Set lifecyclestage if available
          try {
            await client.crm.contacts.basicApi.update(existingContactId, {
              properties: { lifecyclestage: 'lead' }
            });
          } catch (e) {
            // Ignore if property doesn't exist
          }
          
          return existingContactId;
        }
      } catch (searchError) {
        // If search fails, continue to create new contact
        console.warn('HubSpot contact search failed:', searchError);
      }
    }

    // Create new contact
    const createResponse = await client.crm.contacts.basicApi.create({
      properties: {
        ...properties,
        lifecyclestage: 'lead',
      },
    });

    return createResponse.id;
  } catch (error) {
    console.error('HubSpot contact upsert failed:', error);
    return null;
  }
}

/**
 * Create a deal in HubSpot and associate it with a contact
 */
export async function createHubSpotDeal(data: DealData): Promise<string | null> {
  const client = getHubSpotClient();
  if (!client) return null;

  try {
    const properties: Record<string, string> = {
      dealname: data.dealName,
    };

    // Add custom properties if they exist
    if (data.fineType) properties.fine_type = data.fineType;
    if (data.fineDateTime) properties.fine_date_time = data.fineDateTime;
    if (data.fineLocation) properties.fine_location = data.fineLocation;
    if (data.fineAmount) properties.fine_amount = data.fineAmount;
    if (data.finePoints) properties.fine_points = data.finePoints;
    if (data.lawSection) properties.law_section = data.lawSection;
    if (data.caseId) properties.case_id = data.caseId;

    const dealResponse = await client.crm.deals.basicApi.create({
      properties,
      associations: [
        {
          to: { id: data.contactId },
          types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }], // Contact to Deal
        },
      ],
    });

    const dealId = dealResponse.id;

    // Create a note/engagement with case details
    const noteContent = [
      `Case ID: ${data.caseId}`,
      data.fineType ? `Fine Type: ${data.fineType}` : '',
      data.fineDateTime ? `Date/Time: ${data.fineDateTime}` : '',
      data.fineLocation ? `Location: ${data.fineLocation}` : '',
      data.fineAmount ? `Amount: ${data.fineAmount}` : '',
      data.finePoints ? `Points: ${data.finePoints}` : '',
      data.lawSection ? `Law Section: ${data.lawSection}` : '',
      data.reportFileUrl ? `Report File: ${data.reportFileUrl}` : '',
      data.extractedSummary ? `\nExtracted Summary:\n${data.extractedSummary}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await client.crm.engagements.associationsApi.create(
        'note',
        'deal',
        dealId,
        'note',
        {
          type: 'NOTE',
          metadata: {
            body: noteContent,
          },
        } as any
      );
    } catch (noteError) {
      // If note creation fails, try creating an engagement note differently
      try {
        await client.crm.objects.notes.basicApi.create({
          properties: {
            hs_note_body: noteContent,
            hs_timestamp: new Date().toISOString(),
          },
          associations: [
            {
              to: { id: dealId },
              types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 214 }], // Deal to Note
            },
          ],
        });
      } catch (e) {
        console.warn('Failed to create HubSpot note:', e);
        // Continue even if note creation fails
      }
    }

    return dealId;
  } catch (error) {
    console.error('HubSpot deal creation failed:', error);
    return null;
  }
}

/**
 * Update deal stage (for escalation)
 */
export async function updateHubSpotDealStage(dealId: string, stage?: string): Promise<boolean> {
  const client = getHubSpotClient();
  if (!client) return false;

  try {
    const properties: Record<string, string> = {};
    if (stage) {
      properties.dealstage = stage;
    }

    await client.crm.deals.basicApi.update(dealId, { properties });
    return true;
  } catch (error) {
    console.error('HubSpot deal stage update failed:', error);
    return false;
  }
}
