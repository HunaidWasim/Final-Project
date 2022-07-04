const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const createDomPurify = require("dompurify");
// brackets to get only the jsdom of what this returns
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // turns URL into something legible
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
});

/**
 * turns URL into something legible
 */
articleSchema.pre("validate", function(next) {
    if (this.title) {
        // lower = lowercase
        // strict = remove special characters from URL
        this.slug = slugify(this.title, { lower: true, strict: true })
    }

    if (this.markdown) {
        // convert markdown to sanitized HTML
        // then purify the HTML to get rid of any malicious code
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
    }

    next();
});

module.exports = mongoose.model("Article", articleSchema);