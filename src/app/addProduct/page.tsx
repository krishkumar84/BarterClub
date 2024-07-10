"use client"
import { useState } from "react";

function NewProductPage() {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      // API request logic goes here
    } catch (err) {
      console.log(err);
      setError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="clerkId" className="font-medium">Clerk ID</label>
            <input id="clerkId" name="clerkId" type="text" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="userId" className="font-medium">User ID</label>
            <input id="userId" name="userId" type="text" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="title" className="font-medium">Title</label>
            <input id="title" name="title" type="text" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="font-medium">Description</label>
            <textarea 
              id="description" 
              name="description" 
              className="p-2 border rounded h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="condition" className="font-medium">Condition</label>
            <select id="condition" name="condition" className="p-2 border rounded">
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="type" className="font-medium">Type</label>
            <input id="type" name="type" type="text" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="availableQty" className="font-medium">Available Quantity</label>
            <input id="availableQty" name="availableQty" type="number" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="deliveryTime" className="font-medium">Delivery Time</label>
            <input id="deliveryTime" name="deliveryTime" type="text" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="category" className="font-medium">Category</label>
            <input id="category" name="category" type="text" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="price" className="font-medium">Price</label>
            <input id="price" name="price" type="number" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="gst" className="font-medium">GST</label>
            <input id="gst" name="gst" type="number" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="rating" className="font-medium">Rating</label>
            <input id="rating" name="rating" type="number" step="0.1" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="delivery" className="font-medium">Delivery</label>
            <input id="delivery" name="delivery" type="text" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="video" className="font-medium">Video URL</label>
            <input id="video" name="video" type="text" className="p-2 border rounded" />
          </div>
          <button type="submit" className="w-full py-3 bg-teal-500 text-white font-bold rounded mt-4">Add Product</button>
          {error && <span className="text-red-500">{error}</span>}
        </form>
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Upload Images</h2>
          <div className="flex gap-4">
            {images.map((image, index) => (
              <img key={index} src={image} alt="" className="w-1/3 h-32 object-cover rounded" />
            ))}
            {/* Add your UploadWidget component here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewProductPage;
