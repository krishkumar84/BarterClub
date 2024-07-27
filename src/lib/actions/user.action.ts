"use server";

import User from "@/lib/models/user.model";
import { connect } from "@/lib/db";
import createError from "../createError";
import { UpdateUserParams } from '@/types'

export async function createUser(user: any) {
  try {
    await connect();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}
export async function getUserById(userId: string) {
  try {
    await connect()

    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    createError(403,error as string )
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connect()

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })

    if (!updatedUser) throw new Error('User update failed')
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    createError(403,error as string )
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connect()

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId })

    if (!userToDelete) {
      throw new Error('User not found')
    }

    // Unlink relationships
    // await Promise.all([
    //   // Update the 'events' collection to remove references to the user
    //   Event.updateMany(
    //     { _id: { $in: userToDelete.events } },
    //     { $pull: { organizer: userToDelete._id } }
    //   ),

    //   // Update the 'orders' collection to remove references to the user
    //   Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
    // ])

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id)
    // revalidatePath('/')

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    createError(403,error as string )
  }
}