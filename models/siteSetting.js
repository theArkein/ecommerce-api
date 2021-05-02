var mongoose = require('mongoose')
const { Schema } = mongoose;

const schema = new Schema({
    featuredCategory : {
        A: {
            title: {
                type: Schema.Types.String,
            },
            category: {
                type: Schema.Types.ObjectId, 
                default: null,
                ref: 'MainCategory',
            },
            active: {
                type: Schema.Types.Boolean,
                default: false,
            }
        },
        B: {
            title: {
                type: Schema.Types.String,
            },
            category: {
                type: Schema.Types.ObjectId, 
                default: null,
                ref: 'MainCategory',
            },
            active: {
                type: Schema.Types.Boolean,
                default: false,
            }
        },
        C: {
            title: {
                type: Schema.Types.String,
            },
            category: {
                type: Schema.Types.ObjectId, 
                default: null,
                ref: 'MainCategory',
            },
            active: {
                type: Schema.Types.Boolean,
                default: false,
            }
        }
    },
    recommendedCategory : [{
        title: {
            type: Schema.Types.ObjectId,
            require: true
        },
        category: {
            type: Schema.Types.ObjectId, 
            default: null,
            ref: 'MainCategory'
        },
        active: {
            type: Schema.Types.Boolean,
            default: false
        }
    }],
    featuredBanner: {
        large: {
            image: {
                type: Schema.Types.String,
                required: true,
            },
            title: {
                type: Schema.Types.String,
                required: true
            },
            subTitle: {
                type: Schema.Types.String
            },
            btnText: {
                type: Schema.Types.String,
                required: true
            },
            btnLink: {
                type: Schema.Types.String,
                default: "#",
                required: true
            },
            active: {
                type: Schema.Types.Boolean,
                default: true,
            }
        },
        small: [{
            image: {
                type: Schema.Types.String,
                required: true,
            },
            preTitle: {
                type: Schema.Types.String
            },
            title: {
                type: Schema.Types.String,
                required: true
            },
            subTitle: {
                type: Schema.Types.String
            },
            price: {
                type: Schema.Types.String
            },
            link: {
                type: Schema.Types.String,
                default: "#",
                required: true,
            },
            active: {
                type: Schema.Types.Boolean
            }
        }]
    },
    featuredAds: {
        adLeft: {
            image: {
                type: Schema.Types.String,
                required: true
            },
            title: {
                type: Schema.Types.String
            },
            link: {
                type: Schema.Types.String,
                default: '#',
                required: true
            } 
        },
        adCenter: {
            image: {
                type: Schema.Types.String,
                required: true
            },
            title: {
                type: Schema.Types.String
            },
            link: {
                type: Schema.Types.String,
                default: '#',
                required: true
            } 
        },
        adRight: {
            image: {
                type: Schema.Types.String,
                required: true
            },
            title: {
                type: Schema.Types.String
            },
            link: {
                type: Schema.Types.String,
                default: '#',
                required: true
            } 
        },
        adLarge: {
            image: {
                type: Schema.Types.String,
                required: true
            },
            title: {
                type: Schema.Types.String
            },
            link: {
                type: Schema.Types.String,
                default: '#',
                required: true
            } 
        },
    },
    footer: {
        footerMenu: {
            primary: {
                title: {type: Schema.Types.String},
                links: [
                    {
                        name: {type: Schema.Types.String, required: true},
                        link: {type: Schema.Types.String, required: true, default: "#"}
                    }
                ]
            },
            secondary: {
                title: {type: Schema.Types.String},
                links: [
                    {
                        name: {type: Schema.Types.String, required: true},
                        link: {type: Schema.Types.String, required: true, default: "#"}
                    }
                ]
            }
        }
    }
},{timestamps: true});

const SiteSetting = mongoose.model('SiteSetting', schema);
module.exports = SiteSetting