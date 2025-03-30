import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';

import { createUser_DANGEROUS_ONLY_FOR_INTERNAL_USE } from '@/server/user/actions/create';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env'
    );
  }

  const wh = new Webhook(SIGNING_SECRET);

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log('Webhook payload:', body);

  if (eventType === 'user.created') {
    console.log('User created:', evt.data);

    if (evt.data.email_addresses[0].email_address && evt.data.id) {
      const { success } = await createUser_DANGEROUS_ONLY_FOR_INTERNAL_USE({
        clerkId: evt.data.id,
        email: evt.data.email_addresses[0].email_address,
        name: `${evt.data.first_name} ${evt.data.last_name}`,
        avatar: evt?.data?.image_url || ''
      });

      if (!success) {
        return new Response('Error: Failed to create user', {
          status: 400
        });
      }
    }
  }

  if (eventType === 'user.updated') {
    console.log('User updated:', evt.data);

    if (evt.data.email_addresses[0].email_address && evt.data.id) {
      const { success } = await createUser_DANGEROUS_ONLY_FOR_INTERNAL_USE({
        clerkId: evt.data.id,
        email: evt.data.email_addresses[0].email_address,
        name: `${evt.data.first_name} ${evt.data.last_name}`,
        avatar: evt?.data?.image_url || ''
      });

      if (!success) {
        return new Response('Error: Failed to create user', {
          status: 400
        });
      }
    }
  }

  return new Response('Webhook received', { status: 200 });
}
