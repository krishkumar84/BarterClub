"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { productSchema } from "@/lib/validator"
import * as z from 'zod'
import { productDefaultValues } from "@/constants"
import Dropdown from "./Dropdown"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { IProduct } from "@/lib/models/product.model"
import axios from "axios"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ImageSlider from "./ImageSlider"


type PostFormProps = {
  userId: string
  clerkId:string | null
  type: "Create" | "Update"
  post?: IProduct,
  postId?: string
}


const PostForm = ({ userId,clerkId, type, post, postId }: PostFormProps) => {
  // const [files, setFiles] = useState<File[]>([])
  const initialValues = post && type === 'Update' 
    ? { 
      ...post,
    }
    : productDefaultValues;
  const router = useRouter();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues
  })

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const maxFiles = 3; // Limit to 3 files

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) as File[] : [];
    if (files.length > maxFiles) {
      alert(`You can only select up to ${maxFiles} files.`);
      return;
    }
    setSelectedFiles(files);
}

const handleUpload = async () => {
  const urls = await Promise.all(
    selectedFiles.map(async (file, index) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const fileUrl = response.data.url;
      localStorage.setItem(`img${index + 1}`, fileUrl); // Store URLs in localStorage as img1, img2, img3
      return fileUrl;
    })
  )
  // setUploadedUrls(urls);
  getStoredImageUrls();
}

const urls: string[] = [];
const getStoredImageUrls = (): string[] => {
  for (let i = 1; i <= localStorage.length; i++) {
    const url = localStorage.getItem(`img${i}`);
    if (url) {
      urls.push(url);
    }
  }
  setUploadedUrls(urls);
  console.log(urls)
  // alert(urls);
  return urls;
};

 
  async function onSubmit(values: z.infer<typeof productSchema>) {
    console.log('Form Submitted', values);
    const postData = values;
    let uploadedImageUrl = uploadedUrls;
    if(uploadedImageUrl.length === 0) {
      return alert('Please upload images');
    }

    if(type === 'Create') {
      try {
        const newPost = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ clerkId, userId,imageUrl: uploadedImageUrl, body: postData })
        }).then(res => res.json())
        console.log(newPost)
      //   const newEvent = await createEvent({
      //     event: { ...values, imageUrl: uploadedImageUrl },
      //     userId,
      //     path: '/profile'
      //   }
      // )

        if(newPost) {
          form.reset();
          // router.push(`/events/${newEvent._id}`)
        }
      } catch (error) {
        console.log(error);
      }
    }

    if(type === 'Update') {
      if(!postId) {
        router.back()
        return;
      }

      try {
        // const updatedEvent = await updateEvent({
        //   userId,
        //   event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
        //   path: `/events/${eventId}`
        // })

        // if(updatedEvent) {
        //   form.reset();
        //   router.push(`/events/${updatedEvent._id}`)
        // }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Event title" {...field} className="input-field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Dropdown onChangeHandler={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="h-72 w-full">
                    <Textarea placeholder="Description" {...field} className="textarea rounded-2xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
          <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="h-72">
                    <div className="flex flex-col ">
                    <div className="flex flex-row w-full max-w-sm items-start gap-1.5">
                     <Input  id="pictures"
                      type="file"
                      multiple
                     onChange={handleFileChange}
                       />
                     <Button onClick={handleUpload} disabled={selectedFiles.length === 0}>
                     Upload
                   </Button>
                   </div>
                   <div className='flex mt-3 flex-col w-64'>
                     <ImageSlider urls={uploadedUrls} />
                   </div>
                   </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
              </div>


        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Condition</SelectLabel>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="old">Old</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                 </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Product Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Product Type</SelectLabel>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                 </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col mt-5 gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="availableQty"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                     <Label>Available Quantity</Label>
                     <Input type="number" placeholder="Available Quantity" {...field} className="input-field" />
                   </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deliveryTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                     <Label>Delivery time(in days)</Label>
                     <Input type="number" placeholder="Delivery Time" {...field} className="input-field" />
                   </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col mt-5 gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="gst"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                     <Label>Gst(in %)</Label>
                     <Input placeholder="Gst" {...field} className="input-field" />
                   </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                     <Label>Price(in Inr)</Label>
                     <Input type="number" placeholder="Price" {...field} className="input-field" />
                   </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col mt-5 gap-5 md:flex-row">
        <FormField
            control={form.control}
            name="delivery"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Delivery" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Delivery</SelectLabel>
                        <SelectItem value="Free">Free</SelectItem>
                        <SelectItem value="Inr">Inr</SelectItem>
                        <SelectItem value="Barter">Barter Point</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                 </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button 
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="rounded-full h-[54px] p-regular-16 col-span-2 w-full"
        >
          {form.formState.isSubmitting ? (
            'Submitting...'
          ): `${type} Post `}</Button>
      </form>
    </Form>
  )
}

export default PostForm