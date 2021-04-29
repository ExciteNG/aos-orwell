const Banners = require('../../models/adBanner')




const getAllBanners = async (req,res)=>{
    try {
        const allBanners = await Banners.find();
        res.status(200).json({banners: allBanners})
      } catch (e) {
        res.status(400).json({message: 'Oops! Something went wrong!'})
      }
}


const approveBanner = async (req,res)=>{
  const id = req.params.id;
  const status = req.body.status
  // console.log(id,status)

    try {
        const banner = await Banners.findById(id);
        banner.approval=status
        await banner.save()
        res.status(200).json({code:201, msg:"Banner updated"})
      } catch (e) {
        res.status(400).json({message: 'Oops! Something went wrong!'})
      }
}



module.exports = {
    getAllBanners,
    approveBanner
}