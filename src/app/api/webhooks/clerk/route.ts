import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, updateUser, deleteUser } from "@/lib/actions/user.action";
import axios from "axios";

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
    const { id, email_addresses, first_name, last_name, unsafe_metadata } =
      evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      Name: `${first_name} ${last_name}`,
      phone: unsafe_metadata.PhoneNumber,
      Gst: unsafe_metadata.gst,
      Address: unsafe_metadata.address,
    };

    console.log(user);

    try {
      const newUser = await createUser(user);

      if (newUser) {
        try {
          await clerkClient.users.updateUserMetadata(id, {
            publicMetadata: {
              userId: newUser._id,
            },
          });
        } catch (err) {
          console.error("Error updating Clerk metadata:", err);
          // Continue execution even if metadata update fails
        }
        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || "https://barterclub.in";
          await axios.post(`${baseUrl}/api/welcomeMail`, {
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
          });
        } catch (err) {
          console.error("Error sending welcome email:", err);
          if (axios.isAxiosError(err)) {
            console.error("Response data:", err.response?.data);
          }
          // Continue execution even if welcome email fails
        }

        return NextResponse.json({
          message: "New user created",
          user: newUser,
        });
      } else {
        throw new Error("Failed to create user in MongoDB");
      }
    } catch (err) {
      console.error("Error creating user in MongoDB:", err);
      try {
        const clerkUser = await clerkClient.users.getUser(id);
        if (clerkUser) {
          await clerkClient.users.deleteUser(id);
        }
      } catch (clerkErr) {
        console.error("Error deleting user from Clerk:", clerkErr);
      }
      try {
        await deleteUser(id);
      } catch (mongoErr) {
        console.error("Error deleting user from MongoDB:", mongoErr);
      }

      return new Response("Error occurred while creating user in MongoDB", {
        status: 500,
      });
    }
  }

  if (eventType === "user.updated") {
    const { id, image_url, first_name, username } = evt.data;

    const user = {
      Name: first_name,
      username: username!,
      photo: image_url,
    };

    const updatedUser = await updateUser(id, user);

    return NextResponse.json({ message: "OK", user: updatedUser });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const deletedUser = await deleteUser(id!);

    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  return new Response("", { status: 200 });
}
