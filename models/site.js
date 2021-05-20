var mongoose = require('mongoose')
const { Schema } = mongoose;

const schema = new Schema({
    banner: {
        large: {
            image: {
                type: Schema.Types.String,
                default: null
            },
            preTitle: {
                type: Schema.Types.String,
                default: null
            },
            title: {
                type: Schema.Types.String,
                default: null
            },
            subTitle: {
                type: Schema.Types.String,
                default: null
            },
            price: {
                type: Schema.Types.String,
                default: null
            },
            btnText: {
                type: Schema.Types.String,
                default: null
            },
            btnLink: {
                type: Schema.Types.String,
                default: "#",
                
            },
            publish: {
                type: Schema.Types.Boolean,
                default: true,
            }
        },
        small: [{
            image: {
                type: Schema.Types.String,
                default: null
            },
            preTitle: {
                type: Schema.Types.String,
                default: null
            },
            title: {
                type: Schema.Types.String,
                default: null
            },
            subTitle: {
                type: Schema.Types.String,
                default: null
            },
            price: {
                type: Schema.Types.String,
                default: null
            },
            link: {
                type: Schema.Types.String,
                default: "#",
            },
            order: {
                type: Schema.Types.Number,
                default: true,
                unique: true,
            },
            publish: {
                type: Schema.Types.Boolean,
                default: true
            }
        }]
    },
    ads: [{
        image: {
            type: Schema.Types.String,
            default: null        
        },
        title: {
            type: Schema.Types.String,
            default: null        
        },
        btnText: {
            type: Schema.Types.String,
            default: null
        },
        link: {
            type: Schema.Types.String,
            default: '#',
        },
        order: {
            type: Schema.Types.Number,
            unique: true,
        }, 
        publish: {
            type: Schema.Types.Boolean,
            default: true
        }
    }],
    featuredSlider: {
        mostViewed: {
            title: {
                type: Schema.Types.String,
                default: null,        
            },
            publish: {
                type: Schema.Types.Boolean,
                default: null,        
            },
            order:  {
                type: Schema.Types.Number,
                default: null,     
            }, 
            endpoint: {
                type: Schema.Types.String,
                default: null,        
            }
        },
        latest: {
            title: {
                type: Schema.Types.String,
                default: null
            },
            publish: {
                type: Schema.Types.Boolean,
                default: null
            },
            order:  {
                type: Schema.Types.Number,
                default: null
            }, 
            endPoint: {
                type: Schema.Types.String,
                default: null
            }
        },
        flashDeal: {
            title: {
                type: Schema.Types.String,
                default: null
            },
            publish: {
                type: Schema.Types.Boolean,
                default: null
            },
            order:  {
                type: Schema.Types.Number,
                default: null
            }, 
            endpoint: {
                type: Schema.Types.String,
                default: null
            }
        },
    },
    categorySlider: [{
        title: {
            type: Schema.Types.String,
            default: null
        },
        publish: {
            type: Schema.Types.Boolean,
            default: null
        },
        order:  {
            type: Schema.Types.Number,
            default: null
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "MainCategory",
            default: null
        }, 
        endpoint: {
            type: Schema.Types.String,
            default: null
        }
    }],
    recommendedCategory: [{
        title: {
            type: Schema.Types.String,
            default: null
        },
        publish: {
            type: Schema.Types.Boolean,
            default: null
        },
        order:  {
            type: Schema.Types.Number,
            default: null
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "MainCategory",
            default: null
        },
        image: {
            type: Schema.Types.String,
            default: null
        }, 
        endpoint: {
            type: Schema.Types.String,
            default: null
        }
    }]

});

const Site = mongoose.model('Site', schema);
module.exports = Site