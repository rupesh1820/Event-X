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
    creatorId: req.user?.userId || null,
    approvalStatus: req.user?.role === "creator" ? "pending" : "approved",
    approvedBy: req.user?.role === "admin" ? req.user.userId : null,
  })

  await event.save();

  res.status(200).json({message:"Event create Succesfull", event})
  } catch (error) {
    console.error("Event creation failed:", error.message);
    res.status(400).json({ error: error.message });
  }

};

export const GetallEvent=async(req, res)=>{

  try {
    const events= await EventCreate.find({
      $or: [{ approvalStatus: "approved" }, { approvalStatus: { $exists: false } }],
    })
    return res.status(200).json({message:"events founded", events})
    
  } catch (error) {
   return res.status(500).json({messsage: error.message})
  }
}

export const GetEventById= async(req, res)=>{
  try {
    const event= await EventCreate.findById(req.params.id)
    if(!event){
      return res.status(501).json({message: "events not found"})
    }
    return res.status(201).json({message:" event get successfully", event})
  } catch (error) {
    return res.status(401).json({message: "events not found", error})
  }
}

