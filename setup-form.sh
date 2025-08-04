#!/bin/bash

echo "🚀 Formspree Setup Script"
echo "=========================="
echo ""
echo "This script will help you update your Formspree form ID."
echo ""
echo "First, you need to:"
echo "1. Go to https://formspree.io"
echo "2. Sign up with dmir7186@gmail.com"
echo "3. Create a new form"
echo "4. Copy your form ID (the part after /f/ in the URL)"
echo ""
read -p "Enter your Formspree form ID (e.g., abc123xyz): " FORM_ID

if [ -z "$FORM_ID" ]; then
    echo "❌ No form ID provided. Exiting."
    exit 1
fi

echo ""
echo "🔄 Updating files with form ID: $FORM_ID"

# Update index.html
sed -i "s/YOUR_ACTUAL_FORM_ID/$FORM_ID/g" index.html
echo "✅ Updated index.html"

# Update form-config.js
sed -i "s/YOUR_ACTUAL_FORM_ID/$FORM_ID/g" form-config.js
echo "✅ Updated form-config.js"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Commit and push your changes to GitHub"
echo "2. Your form will now send emails to dmir7186@gmail.com"
echo "3. Test the form on your live website"
echo ""
echo "📧 You'll receive emails from: noreply@formspree.io"
echo "📊 View submissions at: https://formspree.io/forms"