export interface Product {
  id: string;
  title: string;
  img: string;
  badges: string[];
  desc: string;
}

// You can easily add more products here or change their order.
// The Popular Products section on the homepage will display the first 3 products by default,
// and expand to show the rest when "See More" is clicked.
export const products: Product[] = [
  {
    id: "ganesha-statue",
    title: "Ganesha Statue",
    img: "/products/ganesha statue.png",
    badges: ["PLA", "15 cm", "Gold", "Statue"],
    desc: "A beautifully detailed 3D printed statue of Lord Ganesha. Perfect for home decor or as a thoughtful gift."
  },
  {
    id: "custom-lithophane",
    title: "Custom Lithophane",
    img: "/products/lithophane.png",
    badges: ["PETG", "Standard", "White", "Decor"],
    desc: "Transform your favorite photos into stunning 3D printed lithophanes that reveal incredible details when backlit."
  },
  {
    id: "michael-jackson-figure",
    title: "Michael Jackson Figure",
    img: "/products/michaeljackson.png",
    badges: ["ABS", "20 cm", "Painted", "Figure"],
    desc: "A highly detailed collectible figure of the King of Pop in his iconic pose. Great for collectors and fans."

  },
];
