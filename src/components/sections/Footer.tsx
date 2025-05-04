import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    
    <footer className="border-t relative  ">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff914d]/20 to-transparent rounded-lg blur-3xl opacity-70 -z-10"></div>
      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Portfolio</h3>
            <p className="text-muted-foreground">
              A personal portfolio showcasing my work, skills, and blog.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-brand"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-brand"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-brand"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-brand"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-brand"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
            <a href="https://www.facebook.com/mehediimun" className="text-muted-foreground hover:text-brand" target="_blank" >
              
              Facebook
            </a>
              <a href="https://x.com/mehediimun" className="text-muted-foreground hover:text-brand" target="_blank" >
              
                X
              </a>
              <a href="https://github.com/mehedi-imun" className="text-muted-foreground hover:text-brand" target="_blank" >
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/mehedi-imun/" className="text-muted-foreground hover:text-brand" target="_blank" >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} Mehedi Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
