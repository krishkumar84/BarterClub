import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser ,updateUser,deleteUser} from "@/lib/actions/user.action";


export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name,unsafe_metadata,phone_numbers } = evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      Name: `${first_name} ${last_name}`,
      phone: unsafe_metadata.phone_number,
      Gst: unsafe_metadata.gst,
      Address: unsafe_metadata.address,
    };

    console.log(user);

    try {
      const newUser = await createUser(user);

      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id,
          },
        });

        return NextResponse.json({ message: "New user created", user: newUser });
      } else {
        throw new Error("Failed to create user in MongoDB");
      }
    } catch (err) {
      console.error("Error creating user in MongoDB:", err);
      // Delete the user from Clerk if creation in MongoDB fails
      await clerkClient.users.deleteUser(id);
      deleteUser(id);

      return new Response("Error occurred while creating user in MongoDB", {
        status: 500,
      });
    }
  }

  if (eventType === 'user.updated') {
    const {id, image_url, first_name, username } = evt.data

    const user = {
      Name: first_name,
      username: username!,
      photo: image_url,
    }

    const updatedUser = await updateUser(id, user)

    return NextResponse.json({ message: 'OK', user: updatedUser })
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    const deletedUser = await deleteUser(id!)

    return NextResponse.json({ message: 'OK', user: deletedUser })
  }

  return new Response("", { status: 200 });
}
