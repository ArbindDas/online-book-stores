
const handleImageUpload = async (image) => {
  if (!image) {
    alert("Please select an image first!");
    return;
  }

  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "my_book_store");
  formData.append("cloud_name", "dt9owkw7t");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dt9owkw7t/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (response.ok) {
      return data.secure_url;
    } else {
      console.error("Upload failed:", data.error.message);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const deleteImageFromCloudinary = async (imageUrl) => {
  const cloudinaryUrlPattern =
    /https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/v(\d+)\/(.+)/;
  const match = imageUrl.match(cloudinaryUrlPattern);

  if (!match) {
    console.error("Invalid Cloudinary URL");
    return;
  }
  const publicId = match[2].split(".")[0]
  try {
    const response = await fetch("http://localhost:3000/delete-image", {
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        publicId
      })
    });
    const data = await response.json();
    if(data.success){
      console.log("Image deleted successfully");
      return true;
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
  return false;
};

export { handleImageUpload, deleteImageFromCloudinary };
