import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-dark text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-poppins font-bold mb-4">
              <span>Beat</span><span className="text-primary">Burn</span>
            </div>
            <p className="text-neutral-200 mb-6">Dance your way to fitness with AI-powered tracking and personalized guidance.</p>
            <div className="flex space-x-4">
              {["instagram", "twitter", "facebook", "youtube"].map(social => (
                <a 
                  key={social}
                  href="#" 
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <i className={`bx bxl-${social}`}></i>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Features</h3>
            <ul className="space-y-2">
              {[
                "AI-Powered Dance Tracking",
                "Personalized Nutrition",
                "Fitness Analytics",
                "AI Fitness Coach",
                "Meal Planner"
              ].map(feature => (
                <li key={feature}>
                  <a href="#" className="text-neutral-200 hover:text-white transition-colors">
                    {feature}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              {[
                "About Us",
                "Careers",
                "Press Kit",
                "Contact",
                "Blog"
              ].map(item => (
                <li key={item}>
                  <a href="#" className="text-neutral-200 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Stay Updated</h3>
            <p className="text-neutral-200 mb-4">Subscribe to our newsletter for the latest fitness tips and features.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-neutral-800 border-none rounded-l-lg px-4 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
              />
              <button className="bg-primary hover:bg-primary-dark text-white rounded-r-lg px-4 transition-colors">
                <i className='bx bx-right-arrow-alt'></i>
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-neutral-400 text-sm mb-4 md:mb-0">
            © 2023 BeatBurn. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-neutral-400">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map(item => (
              <a key={item} href="#" className="hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
