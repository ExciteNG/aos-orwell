const mongoose = require('./init')
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


const merchantInfluencerSchema = mongoose.Schema({
    email: {
        type: String,
        validate: {
            validator: function (v) {
                return emailRegexVal.test(v)
            },
            message: mail => `${mail.value} is not a valid email address !`
        },
        required: [true, 'Please enter your email address'],
        lowercase:true
    },
    userType: {
        type: String,
        default: "EX10AF"
    },
    productName: {
        type: String,
        required: true
    },
    reasonForProm: {
        type: String,
        required: true
    },
    uniqueQualities: {
        type: String,
        required: true
    },
    permanentPosts: {
        type: String
    },
    contactPreference: {
        type: String,
        default: ""
    },
    modeOfContact: {
        type: Array,
        default: []
    },
    mediaPlacement: {
        type: Array,
        default: []
    },
    influencerLevel: {
        type: String,
        required: true
    },
    productUsers: {
        type: Array,
        default: []
    },
    reach: {
        type: Number,
        required: true
    },
    productPrice: {
        type: String,
        required: true
    },
    competitors: {
        type: Array,
        default: []
    },
    productServiceCategory: {
        type: String,
        default: ""
    },
    contentCreator: {
        type: String,
        required: true
    },
    noOfPosts: {
        type: String,
        required: true
    },
    timeUnit:{
        type:String
    },
    output:{
        type:Number,
        default:1
    },
    unitPost: {
        type: Number,
        default: 1
    },
    durationOfPromotion: {
        type: String,
        required: true
    },
    unitMonth: {
        type: Number,
        default: 1
    },
    crossPlatformPromotion: {
        type: String
    },
    deliverable: {
        type: String,
        default: ""
    },
    deliveryType: {
        type: Array,
        default: []
    },
    coverage: {
        type:String,
        default:""
    },
    pricing: {
        type: Array,
        default: [0, 0]
    },
    unitPricing: {
        type: Array,
        default: [0, 0]
    },
    offerPrice: {
        type: String,
        default: ""
    },
    influencerName:{
        type:String,
    },
    assignedInfluencer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "influencer"
    }]
}, { timestamps: true })
module.exports = mongoose.model('merchantInfluencer', merchantInfluencerSchema)