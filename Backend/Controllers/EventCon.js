import EventCreate from "../Models/CreateEvents.js";

 export const eventCreate = async (req, res) => {
  try {
    const {
    title,
    category,
    shortDescription,
    hostName,
    audience,
    eventType,
    venueName,
    city,
    address,
    date,
    time,
    duration,
    imageUrl,
    maxCapacity,
    ticketType,
    ticketPrice,
    earlyBirdPrice,
    featured,
    tags,
    refundPolicy,
    live,
  } = req.body;

  const uploadedImage = req.file?.path || req.file?.secure_url || null;
  const image = uploadedImage || imageUrl?.trim() || null;

  console.log("Event image upload:", {
    fileReceived: Boolean(req.file),
    uploadedImage,
    imageUrlProvided: Boolean(imageUrl),
  });

  if (!image) {
    return res.status(400).json({ error: "Please upload an image or provide an image URL." });
  }

  const event= new EventCreate({
    title,
    category,
    shortDescription,
    hostName,
    audience,
    eventType,
    venueName,
    city,
    address,
    date,
    time,
    duration,
    imageUrl: uploadedImage || imageUrl.trim(),
    image,
    maxCapacity,
    ticketType,
    ticketPrice,
    earlyBirdPrice,
    featured,
    tags,
    refundPolicy,
    live,
  })

  await event.save();

  res.status(200).json({message:"Event create Succesfull", event})
  } catch (error) {
    console.error("Event creation failed:", error.message);
    res.status(400).json({ error: error.message });
  }

};

