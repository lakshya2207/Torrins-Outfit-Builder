👗 Outfit Builder – Interactive Fashion Design Tool
A modern, feature-rich web app for creating and customizing fashion outfits. Includes drag-and-drop functionality, zoom controls, a shopping cart, and export options — all in a clean, responsive interface.

🚀 Quick Start
Prerequisites
Node.js (v18+)

npm or yarn

Installation
bash
Copy
Edit
git clone <repository-url>
cd assignment
npm install
npm run dev
Open your browser at http://localhost:3000.

🎯 Core Features
🛍 Product Management
Categories: Accessories, Tops, Bottoms, Shoes

Sidebar displays: Image, Name, Price

Category-based filtering

Organized product data (ID, Name, Price, Image URL, Type)

🖱 Drag & Drop Canvas
Drag items from sidebar to canvas

Prevent duplicate items

Visual feedback while dragging

Defined drop zone with styling

🖼 Canvas Area
Resizable workspace

Move and scale items freely

Click to bring to front (Z-index control)

Responsive and interactive layout

🛒 Shopping Cart
Add canvas products to cart (non-destructive)

Modify item quantities (+/-)

Remove individual products

Slide-in cart drawer

Total price auto-calculation

📸 Export Feature
Export canvas as PNG

Resize canvas before export

Uses html2canvas-pro for image generation

🧰 Tech Stack
Frontend: React 18 (TypeScript)

Framework: Next.js 15 (App Router)

Styling: Tailwind CSS

UI Library: Shadcn UI

Animation: Framer Motion

Image Export: html2canvas-pro

Icons: React Icons, Lucide React

📁 Project Structure
bash
Copy
Edit
assignment/
├── src/
│   ├── app/
│   │   ├── page.tsx         # Main app page
│   │   └── test/page.tsx    # Layering test page
│   ├── components/
│   │   ├── CartDrawer.tsx
│   │   ├── ZoomModal.tsx
│   │   └── ui/
│   └── data/sampleData.js   # Product definitions
├── public/
│   ├── accessories/
│   ├── tops/
│   ├── bottoms/
│   └── shoes/
└── package.json
⚙️ Development Commands
bash
Copy
Edit
npm install        # Install dependencies
npm run dev        # Run development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run lint checks
🎨 Customization
➕ Add New Products
Add images to /public/[category]/

Update src/data/sampleData.js with:

js
Copy
Edit
{
  prid: "unique-id",
  name: "Product Name",
  price: 29.99,
  imgurl: "/[category]/image.png",
  type: "category"
}
🎨 Modify Styling
Update Tailwind classes in components

Global styles in src/app/globals.css

🛠 Add New Features
Extend product schema in sampleData.js

Add components in src/components/

Update logic in src/app/page.tsx

🤝 Contributing
Fork the repository

Create a feature branch

Make your changes

Test thoroughly

Submit a pull request

📄 License
Licensed under the MIT License.

Built with ❤️ using React, Next.js, and Tailwind CSS

📬 Contact
📞 Phone: 7906396246

📧 Email: lakshyasharma1928@gmail.com

🌐 Portfolio: lakshya2207

🧑‍💻 GitHub: lakshya2207

